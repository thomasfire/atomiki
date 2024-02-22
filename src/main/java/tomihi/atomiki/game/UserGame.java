package tomihi.atomiki.game;

import lombok.Data;

@Data
public class UserGame {
    Status status = Status.SETTING;
    private MovesLog movesLog = new MovesLog();
    private Field field;
    CompetitorMarks competitorMarks;

    public UserGame(GameSettings settings) {
        this.field = new Field(settings);
        this.competitorMarks = new CompetitorMarks(settings.getAtomsMaxCount());
    }
}
