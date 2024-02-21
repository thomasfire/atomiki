package tomihi.atomiki.game;

import lombok.Data;

@Data
public class UserGame {
    Status status = Status.SETTING;
    private Log log = new Log();
    private Field field;

    public UserGame(GameSettings settings) {
        this.field = new Field(settings);
    }
}
