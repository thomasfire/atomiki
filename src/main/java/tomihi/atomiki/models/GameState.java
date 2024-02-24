package tomihi.atomiki.models;

import lombok.Data;
import tomihi.atomiki.game.*;

@Data
public class GameState {
    private String id;
    private User owner;
    private User competitor;
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

    public GameState(String id, User owner, User competitor, Game game) {
        this.id = id;
        this.owner = owner;
        this.competitor = competitor;
        this.gameSettings = game.getGameSettings();
        this.ownerGame = new CompressedUserGame(game.getOwner());
        this.competitorGame = new CompressedUserGame(game.getCompetitor());
        this.movesCounter = game.getMovesCounter();
    }
}
