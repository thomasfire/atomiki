package tomihi.atomiki.game;

import lombok.Data;

@Data
public class Game {
    private GameSettings gameSettings;
    private UserGame owner;
    private UserGame competitor;

    int movesCounter = 0;

    public Game(GameSettings gameSettings) {
        this.gameSettings = gameSettings;
        this.owner = new UserGame(this.gameSettings);
        this.competitor = new UserGame(this.gameSettings);
    }

    private UserGame getTargetGame(boolean isOwner) {
        return isOwner ? this.owner : this.competitor;
    }

    public MoveResult makeMove(Coords coords, boolean isOwner) throws IllegalMoveException, WrongActionForCoords {
        UserGame target = this.getTargetGame(isOwner);
        UserGame otherTarget = this.getTargetGame(!isOwner);
        if ((isOwner && movesCounter % 2 == 1)
                || (!isOwner && movesCounter % 2 == 0)
                || (target.getStatus() != Status.STARTED)
                || (otherTarget.getStatus() == Status.SETTING)
        ) {
            throw new IllegalMoveException();
        }

        MoveResult result = otherTarget.getField().processShoot(coords);

        // End game if other finished
        if ((otherTarget.getStatus() == Status.SETTING)) {
            target.setStatus(Status.FINISHED);
        }

        target.getLog().addToLog(result.trace.getTrace().getFirst(), result.lastCoordTraceble ? result.trace.lastPoint() : null);

        movesCounter++;

        return result;
    }

    // TODO set atoms and other stuff


}
