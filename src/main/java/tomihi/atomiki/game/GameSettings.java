package tomihi.atomiki.game;

import lombok.Data;

@Data
public class GameSettings {
    private int fieldSize;
    private int atomsMaxCount;

    public GameSettings(int fieldSize, int atomsMaxCount) {
        this.fieldSize = fieldSize;
        this.atomsMaxCount = atomsMaxCount;
    }
}
