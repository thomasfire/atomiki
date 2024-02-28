package tomihi.atomiki.models;

import tomihi.atomiki.game.*;

public class CompressedUserGame {
    private final Status status;
    private final CompressedMovesLog movesLog;
    private final CompressedField field;
    private final CompetitorMarks competitorMarks;

    public CompressedUserGame(UserGame userGame) {
        this.status = userGame.getStatus();
        this.movesLog = new CompressedMovesLog(userGame.getMovesLog());
        this.field = new CompressedField(userGame.getField());
        this.competitorMarks = userGame.getCompetitorMarks();
    }

    public UserGame toUserGame(GameSettings gameSettings) throws WrongActionForCoords, ImpossibleAtomLocationException, AtomsOverflowException {
        return new UserGame(this.status, this.movesLog.toMovesLog(), this.field.toField(gameSettings), this.competitorMarks);
    }
}
