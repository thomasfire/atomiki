package tomihi.atomiki.models;

import lombok.Data;
import org.springframework.data.redis.core.RedisHash;
import tomihi.atomiki.game.*;

@Data
@RedisHash("Games")
public class GameState {
    private String id;
    private String ownerId;
    private String competitorId;
    private GameSettings gameSettings;
    private CompressedUserGame ownerGame;
    private CompressedUserGame competitorGame;
    private Integer movesCounter;

    public Game toGame() throws WrongActionForCoords, ImpossibleAtomLocationException, AtomsOverflowException {
        return new Game(
                this.gameSettings,
                this.ownerGame.toUserGame(this.gameSettings),
                this.competitorGame.toUserGame(this.gameSettings),
                this.movesCounter);
    }

    public GameState(String id, String ownerId, String competitorId, Game game) {
        this.id = id;
        this.ownerId = ownerId;
        this.competitorId = competitorId;
        this.gameSettings = game.getGameSettings();
        this.ownerGame = new CompressedUserGame(game.getOwner());
        this.competitorGame = new CompressedUserGame(game.getCompetitor());
        this.movesCounter = game.getMovesCounter();
    }

    public GameState(GameState previous, Game game) {
        this.id = previous.getId();
        this.ownerId = previous.getOwnerId();
        this.competitorId = previous.getCompetitorId();
        this.gameSettings = game.getGameSettings();
        this.ownerGame = new CompressedUserGame(game.getOwner());
        this.competitorGame = new CompressedUserGame(game.getCompetitor());
        this.movesCounter = game.getMovesCounter();
    }

    public GameState(String id, String ownerId) {
        this.id = id;
        this.ownerId = ownerId;
    }

    public GameState() {
    }
}
