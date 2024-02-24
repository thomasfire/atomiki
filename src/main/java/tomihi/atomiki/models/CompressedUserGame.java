package tomihi.atomiki.models;

import tomihi.atomiki.game.*;

public class CompressedUserGame {
    Status status;
    private CompressedMovesLog movesLog;
    private CompressedField field;
    CompetitorMarks competitorMarks;

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
