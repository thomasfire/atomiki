package tomihi.atomiki.game;

import lombok.Data;

@Data
public class UserGame {
    private Status status = Status.SETTING;
    private MovesLog movesLog = new MovesLog();
    private Field field;
    private CompetitorMarks competitorMarks;

    public UserGame(GameSettings settings) {
        this.field = new Field(settings);
        this.competitorMarks = new CompetitorMarks(settings.getAtomsMaxCount());
    }

    public UserGame(Status status, MovesLog movesLog, Field field, CompetitorMarks competitorMarks) {
        this.status = status;
        this.movesLog = movesLog;
        this.field = field;
        this.competitorMarks = competitorMarks;
    }
}
