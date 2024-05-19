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

    public void initializeWithSettings(GameSettings settings) {
        this.setGameSettings(settings);
        UserGame ownerGame = new UserGame(this.getGameSettings());
        UserGame competitorGame = new UserGame(this.getGameSettings());
        this.setOwnerGame(CompressedUserGame.fromUserGame(ownerGame));
        this.setCompetitorGame(CompressedUserGame.fromUserGame(competitorGame));
    }

    public String getOtherUser(boolean isOwner) {
        return isOwner ? this.competitorId : this.ownerId;
    }

    public static GameState fromPreviousStateAndGame(GameState previous, Game game) {
        return new GameState(previous, game);
    }

    public static GameState emptyGameFromId(String id, String ownerId) {
        return new GameState(id, ownerId);
    }

    private GameState(GameState previous, Game game) {
        this.id = previous.getId();
        this.ownerId = previous.getOwnerId();
        this.competitorId = previous.getCompetitorId();
        this.gameSettings = game.getGameSettings();
        this.ownerGame = CompressedUserGame.fromUserGame(game.getOwner());
        this.competitorGame = CompressedUserGame.fromUserGame(game.getCompetitor());
        this.movesCounter = game.getMovesCounter();
    }

    private GameState(String id, String ownerId) {
        this.id = id;
        this.ownerId = ownerId;
        this.movesCounter = 0;
    }

    public GameState() {
    }
}
