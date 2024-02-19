package tomihi.atomiki.game;

import lombok.Data;

import java.util.Objects;

@Data
public class Direction implements Vector {
    int x = 0;
    int y = 0;

    public Direction(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public Direction rotate() {
        return new Direction(y, x);
    }
}
