package tomihi.atomiki.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.server.ResponseStatusException;
import tomihi.atomiki.dto.*;
import tomihi.atomiki.game.*;
import tomihi.atomiki.models.GameState;
import tomihi.atomiki.models.UserToGame;
import tomihi.atomiki.repositories.GameRepository;
import tomihi.atomiki.repositories.UserToGameRepository;

// This controller should be responsible for the websocket process in the game
@Controller
public class GameSocketController {
    GameRepository gameRepository;
    UserToGameRepository userToGameRepository;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    public GameSocketController(GameRepository gameRepository, UserToGameRepository userToGameRepository) {
        this.gameRepository = gameRepository;
        this.userToGameRepository = userToGameRepository;
    }

    private GameState getGameStateFromUserId(String userId) {
        UserToGame userToGame = this.userToGameRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        GameState gameState = this.gameRepository.findById(userToGame.getGameId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User to Game map is mapping to non existent game"));

        final boolean isOwner = gameState.getOwnerId().equals(userId);
        final boolean isCompetitor = gameState.getCompetitorId().equals(userId);

        if (isOwner == isCompetitor) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User to Game is mapping to inconsistent game");
        }
        return gameState;
    }

    @MessageMapping("/set-own-atoms/{userId}")
    public void setOwnAtoms(@Payload AtomsSetDTO atomsSetDTO, @Header String userId) throws WrongActionForCoords,
            ImpossibleAtomLocationException, AtomsOverflowException {
        // Verifies userID exists, there is no other atoms, verifies game not started, verifies atoms constraints,
        // saves atoms to the db, sends to owner confirmation (same atoms), sends notification to other user
        final GameState initialState = this.getGameStateFromUserId(userId);

        Game game = initialState.toGame();
        final boolean isOwner = initialState.getOwnerId().equals(userId);
        final String otherUser = isOwner ? initialState.getOwnerId() : initialState.getCompetitorId();

        for (Coords atom : atomsSetDTO.getCoordsList()) {
            game.setAtom(atom, isOwner);
        }

        game.startGame(isOwner);

        final GameState newGameState = new GameState(initialState, game);
        this.gameRepository.save(newGameState);

        this.simpMessagingTemplate.convertAndSend("/secured/user/" + userId, atomsSetDTO);
        this.simpMessagingTemplate.convertAndSend("/secured/user/" + otherUser,
                new CompetitorNotificationDTO(CompetitorNotificationDTO.NOTIFICATION_TYPES.COMPETITOR_SET,
                        "Competitor set their atoms", null));
    }

    @MessageMapping("/make-move/{userId}")
    public void makeMovement(@Payload AtomsMovementDTO atomsMovementDTO, @Header String userId) throws WrongActionForCoords,
            ImpossibleAtomLocationException, AtomsOverflowException, IllegalMoveException {
        // Verifies:  userID exists, game started, has right to move, no such movement before,
        // processes movement in the game engine, saves to the db and sends the result to the owner, and trace to the competitor
        final GameState initialState = this.getGameStateFromUserId(userId);

        Game game = initialState.toGame();
        final boolean isOwner = initialState.getOwnerId().equals(userId);
        final String otherUser = isOwner ? initialState.getOwnerId() : initialState.getCompetitorId();

        MoveResult moveResult = game.makeMove(atomsMovementDTO.getCoords(), isOwner);

        LogEntry logEntry = game.getMovesLog(isOwner).getLogEntries().getLast();
        Trace trace = moveResult.getTrace();

        final GameState newGameState = new GameState(initialState, game);
        this.gameRepository.save(newGameState);

        // Rick and Dick were about to get their salary.
        // Unfortunately, the counting house messed everything up.
        // So, Dick got Rick's salary, and Rick got Dick's.
        this.simpMessagingTemplate.convertAndSend("/secured/user/" + userId, logEntry);
        this.simpMessagingTemplate.convertAndSend("/secured/user/" + otherUser,
                new CompetitorNotificationDTO(CompetitorNotificationDTO.NOTIFICATION_TYPES.COMPETITOR_MOVED,
                        "Competitor made move", trace));
    }

    @MessageMapping("/mark-atom/{userId}")
    public void markCompetitorAtom(@Payload AtomsMarkDTO atomsMarkDTO, @Header String userId) throws WrongActionForCoords,
            ImpossibleAtomLocationException, AtomsOverflowException {
        // Verifies:  userID exists, game started, no such mark before, not finished
        // processes mark in the game engine, saves to the db and sends the result to the owner, and trace to the competitor
        final GameState initialState = this.getGameStateFromUserId(userId);
        Game game = initialState.toGame();
        final boolean isOwner = initialState.getOwnerId().equals(userId);
        final String otherUser = isOwner ? initialState.getOwnerId() : initialState.getCompetitorId();

        if (atomsMarkDTO.isMark()) {
            game.markAtom(atomsMarkDTO.getCoords(), isOwner);
        } else {
            game.unmarkAtom(atomsMarkDTO.getCoords(), isOwner);
        }

        final GameState newGameState = new GameState(initialState, game);
        this.gameRepository.save(newGameState);

        this.simpMessagingTemplate.convertAndSend("/secured/user/" + userId, atomsMarkDTO);
        this.simpMessagingTemplate.convertAndSend("/secured/user/" + otherUser,
                new CompetitorNotificationDTO(CompetitorNotificationDTO.NOTIFICATION_TYPES.COMPETITOR_MARKED,
                        "Competitor marked the atom", atomsMarkDTO));
    }

    @MessageMapping("/finish/{userId}")
    public void finishGame(@Header String userId) throws WrongActionForCoords, ImpossibleAtomLocationException, AtomsOverflowException {
        // Verifies:  userID exists, game started, owner not finished before
        // processes in the game engine, saves to the db, and sends the result to the owner, and notification to the competitor
        // may give the competitor right to move, if it is even.
        final GameState initialState = this.getGameStateFromUserId(userId);
        Game game = initialState.toGame();
        final boolean isOwner = initialState.getOwnerId().equals(userId);
        final String otherUser = isOwner ? initialState.getOwnerId() : initialState.getCompetitorId();

        game.finishGame(isOwner);

        final GameState newGameState = new GameState(initialState, game);
        this.gameRepository.save(newGameState);

        GameResults gameResults = game.hasBothFinished() ? game.getGameResults() : null;

        this.simpMessagingTemplate.convertAndSend("/secured/user/" + userId,
                new CompetitorNotificationDTO(CompetitorNotificationDTO.NOTIFICATION_TYPES.OWNER_FINISHED,
                        "Competitor finished the game", gameResults));
        this.simpMessagingTemplate.convertAndSend("/secured/user/" + otherUser,
                new CompetitorNotificationDTO(CompetitorNotificationDTO.NOTIFICATION_TYPES.COMPETITOR_FINISHED,
                        "Competitor finished the game", gameResults));
    }

    @MessageMapping("/logs/{userId}")
    public void getLogs(@Header String userId) throws WrongActionForCoords, ImpossibleAtomLocationException, AtomsOverflowException {
        // Verifies:  userID exists, game started, owner not finished before
        // gets movements from db and forms logs and sends to owner
        final GameState initialState = this.getGameStateFromUserId(userId);
        Game game = initialState.toGame();
        final boolean isOwner = initialState.getOwnerId().equals(userId);

        this.simpMessagingTemplate.convertAndSend("/secured/user/" + userId, game.getMovesLog(isOwner).getLogEntries());
    }

    // TODO also error handler somewhere here

}
