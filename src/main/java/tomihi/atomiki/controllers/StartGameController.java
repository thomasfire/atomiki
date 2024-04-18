package tomihi.atomiki.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tomihi.atomiki.dto.CompetitorNotificationDTO;
import tomihi.atomiki.dto.CredentialDTO;
import tomihi.atomiki.dto.GameSettingsDTO;
import tomihi.atomiki.dto.OwnGameStateDTO;
import tomihi.atomiki.game.GameFactory;
import tomihi.atomiki.game.GameSettings;
import tomihi.atomiki.models.GameState;
import tomihi.atomiki.models.UserToGame;
import tomihi.atomiki.repositories.GameRepository;
import tomihi.atomiki.repositories.UserToGameRepository;
import tomihi.atomiki.utils.UUIDHelper;

import java.util.Arrays;
import java.util.List;


@RestController
@RequestMapping("/")
public class StartGameController {
    // there should be repositories and constructor
    private final GameRepository gameRepository;
    private final UserToGameRepository userToGameRepository;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    public StartGameController(final GameRepository gameRepository, final UserToGameRepository userToGameRepository) {
        this.gameRepository = gameRepository;
        this.userToGameRepository = userToGameRepository;
    }

    @PostMapping("/create")
    public CredentialDTO createNewGame() {
        // This method should just generate new credentials and put them into repo
        String gameId = UUIDHelper.generateUUID();
        String ownerId = UUIDHelper.generateUUID();

        this.userToGameRepository.save(new UserToGame(ownerId, gameId));

        GameState initialState = new GameState(gameId, ownerId);
        this.gameRepository.save(initialState);

        return new CredentialDTO(ownerId, gameId);
    }

    @GetMapping("/join/{gameId}")
    public GameSettingsDTO joinNewGame(@PathVariable String gameId) {
        // This method should verify game id and that there is no second user already, and return game settings
        // which include the credential
        GameState existingState = this.gameRepository.findById(gameId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (existingState.getCompetitorId() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }

        String competitorId = UUIDHelper.generateUUID();
        existingState.setCompetitorId(competitorId);

        this.userToGameRepository.save(new UserToGame(competitorId, gameId));
        this.gameRepository.save(existingState);

        this.simpMessagingTemplate.convertAndSend("/notifications/" + existingState.getOwnerId(),
                new CompetitorNotificationDTO(CompetitorNotificationDTO.NOTIFICATION_TYPES.COMPETITOR_JOINED,
                        "Competitor joined the game", null));

        return new GameSettingsDTO(new CredentialDTO(competitorId, gameId), existingState.getGameSettings());
    }

    private boolean checkAuthorization(GameState gameState, String userId) {
        return gameState.getOwnerId().equals(userId) ^
                (gameState.getCompetitorId() != null && gameState.getCompetitorId().equals(userId));
    }

    @GetMapping("/login/{userId}/{gameId}")
    public OwnGameStateDTO loginExistingGame(@PathVariable String userId, @PathVariable String gameId) {
        // This method should verify game id and that the game is ongoing, and return game settings
        // which include the credential. This method is used on connection interruptions.
        // All the game log stuff will be in websocket service

        GameState existingState = this.gameRepository.findById(gameId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        final boolean isOwner = existingState.getOwnerId().equals(userId);

        if (!this.checkAuthorization(existingState, userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        return OwnGameStateDTO.fromGameState(existingState, isOwner);
    }

    @PostMapping("/set")
    public GameSettingsDTO setSettings(@RequestBody GameSettingsDTO gameSettingsDTO) {
        // This method should verify and save settings from user and set the game to be set
        GameState existingState = this.gameRepository.findById(gameSettingsDTO.getCredentials().getGameId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!existingState.getOwnerId().equals(gameSettingsDTO.getCredentials().getUserId())) { // only owner can
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        if (!GameFactory.isValidSettings(gameSettingsDTO.getSettings())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid settings");
        }

        existingState.initializeWithSettings(gameSettingsDTO.getSettings());
        this.gameRepository.save(existingState);

        return new GameSettingsDTO(gameSettingsDTO.getCredentials(), existingState.getGameSettings());
    }

    @GetMapping("/getAvailableSettings")
    public List<GameSettings> getSettings() {
        return Arrays.asList(GameFactory.VARIANTS);
    }
}
