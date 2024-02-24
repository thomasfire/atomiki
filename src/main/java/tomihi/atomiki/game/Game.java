package tomihi.atomiki.game;

import lombok.Data;

@Data
public class Game {
    private GameSettings gameSettings;
    private UserGame owner;
    private UserGame competitor;

    private int movesCounter = 0;

    public Game(GameSettings gameSettings) {
        this.gameSettings = gameSettings;
        this.owner = new UserGame(this.gameSettings);
        this.competitor = new UserGame(this.gameSettings);
    }

    public Game(GameSettings gameSettings, UserGame owner, UserGame competitor, int movesCounter) {
        this.gameSettings = gameSettings;
        this.owner = owner;
        this.competitor = competitor;
        this.movesCounter = movesCounter;
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

        target.getMovesLog().addToLog(result.trace.getTrace().getFirst(), result.lastCoordTraceble ? result.trace.lastPoint() : null);

        movesCounter++;

        return result;
    }

    public Coords setAtom(Coords coords, boolean isOwner) throws ImpossibleAtomLocationException, AtomsOverflowException {
        UserGame target = this.getTargetGame(isOwner);
        if (target.getStatus() != Status.SETTING) {
            throw new IllegalStateException();
        }

        target.getField().setAtom(coords);
        return coords;
    }

    public Coords markAtom(Coords coords, boolean isOwner) throws AtomsOverflowException {
        UserGame target = this.getTargetGame(isOwner);
        if (target.getStatus() != Status.STARTED) {
            throw new IllegalStateException();
        }

        target.getCompetitorMarks().addMark(coords);
        return coords;
    }

    public Coords unmarkAtom(Coords coords, boolean isOwner) {
        UserGame target = this.getTargetGame(isOwner);
        if (target.getStatus() != Status.STARTED) {
            throw new IllegalStateException();
        }

        target.getCompetitorMarks().removeMark(coords);
        return coords;
    }

    public void startGame(boolean isOwner) {
        UserGame target = this.getTargetGame(isOwner);
        if (target.getStatus() != Status.SETTING) {
            throw new IllegalStateException();
        }
        target.setStatus(Status.STARTED);
    }

    public void finishGame(boolean isOwner) {
        UserGame target = this.getTargetGame(isOwner);
        if (target.getStatus() != Status.STARTED) {
            throw new IllegalStateException();
        }
        target.setStatus(Status.FINISHED);
    }

    public MovesLog getMovesLog(boolean isOwner) {
        UserGame target = this.getTargetGame(isOwner);
        return target.getMovesLog();

    }
}
