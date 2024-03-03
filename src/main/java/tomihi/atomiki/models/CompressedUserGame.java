package tomihi.atomiki.models;

import lombok.Data;
import org.springframework.lang.NonNull;
import tomihi.atomiki.game.*;

@Data
public class CompressedUserGame {
    private Status status;
    @NonNull
    private CompressedMovesLog movesLog;
    @NonNull
    private CompressedField field;
    private CompetitorMarks competitorMarks;

    public CompressedUserGame(UserGame userGame) {
        this.status = userGame.getStatus();
        this.movesLog = new CompressedMovesLog(userGame.getMovesLog());
        this.field = new CompressedField(userGame.getField());
        this.competitorMarks = userGame.getCompetitorMarks();
    }

    public CompressedUserGame() {
    }

    public UserGame toUserGame(GameSettings gameSettings) throws WrongActionForCoords, ImpossibleAtomLocationException, AtomsOverflowException {
        return new UserGame(this.status, this.movesLog.toMovesLog(), this.field.toField(gameSettings), this.competitorMarks);
    }
}
