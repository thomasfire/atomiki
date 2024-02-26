package tomihi.atomiki.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tomihi.atomiki.dto.CredentialDTO;
import tomihi.atomiki.dto.GameSettingsDTO;
import tomihi.atomiki.game.GameFactory;
import tomihi.atomiki.game.GameSettings;
import tomihi.atomiki.models.GameState;
import tomihi.atomiki.models.UserToGame;
import tomihi.atomiki.repositories.GameRepository;
import tomihi.atomiki.repositories.UserToGameRepository;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/")
public class StartGameController {
    // there should be repositories and constructor
    GameRepository gameRepository;
    UserToGameRepository userToGameRepository;

    public StartGameController(GameRepository gameRepository, UserToGameRepository userToGameRepository) {
        this.gameRepository = gameRepository;
        this.userToGameRepository = userToGameRepository;
    }

    @PostMapping("/create")
    public CredentialDTO createNewGame() {
        // This method should just generate new credentials and put them into repo
        String gameId = UUID.randomUUID().toString();
        String ownerId = UUID.randomUUID().toString();

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

        if (existingState.getCompetitorGame() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }

        String competitorId = UUID.randomUUID().toString();
        existingState.setCompetitorId(competitorId);

        this.userToGameRepository.save(new UserToGame(competitorId, gameId));
        this.gameRepository.save(existingState);

        return new GameSettingsDTO(new CredentialDTO(competitorId, gameId), existingState.getGameSettings());
    }

    private boolean checkAuthorization(GameState gameState, String userId) {
        return gameState.getOwnerId().equals(userId) ^
                (gameState.getCompetitorId() != null && !gameState.getCompetitorId().equals(userId));
    }

    @GetMapping("/login/{userId}/{gameId}")
    public GameSettingsDTO loginExistingGame(@PathVariable String userId, @PathVariable String gameId) {
        // This method should verify game id and that the game is ongoing, and return game settings
        // which include the credential. This method is used on connection interruptions.
        // All the game log stuff will be in websocket service

        GameState existingState = this.gameRepository.findById(gameId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!this.checkAuthorization(existingState, userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        return new GameSettingsDTO(new CredentialDTO(userId, gameId), existingState.getGameSettings());
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

        existingState.setGameSettings(gameSettingsDTO.getSettings());
        this.gameRepository.save(existingState);

        return new GameSettingsDTO(gameSettingsDTO.getCredentials(), existingState.getGameSettings());
    }

    @GetMapping("/getAvailableSettings")
    public List<GameSettings> getSettings() {
        return Arrays.asList(GameFactory.VARIANTS);
    }
}
