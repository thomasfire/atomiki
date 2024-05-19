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

    private CompressedUserGame(UserGame userGame) {
        this.status = userGame.getStatus();
        this.movesLog = CompressedMovesLog.fromMovesLog(userGame.getMovesLog());
        this.field = CompressedField.fromField(userGame.getField());
        this.competitorMarks = userGame.getCompetitorMarks();
    }

    public CompressedUserGame() {
    }

    public static CompressedUserGame fromUserGame(UserGame userGame) {
        return new CompressedUserGame(userGame);
    }

    public UserGame toUserGame(GameSettings gameSettings) throws WrongActionForCoords, ImpossibleAtomLocationException, AtomsOverflowException {
        return new UserGame(this.status, this.movesLog.toMovesLog(), this.field.toField(gameSettings), this.competitorMarks);
    }
}
