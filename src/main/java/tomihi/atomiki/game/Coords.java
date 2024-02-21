package tomihi.atomiki.game;

import lombok.Data;

@Data
public class Coords implements Vector {
    int x;
    int y;

    public Coords(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public Coords addMovement(Direction movement) {
        return new Coords(this.x + movement.getX(), this.y + movement.getY());
    }
}
