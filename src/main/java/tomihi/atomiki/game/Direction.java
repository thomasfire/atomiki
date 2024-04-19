package tomihi.atomiki.game;

import lombok.Data;

@Data
public class Direction implements Vector {
    public final static Direction NULL_DIRECTION = new Direction(0, 0);
    public final static Direction DIRECTION_UP = new Direction(0, -1);
    public final static Direction DIRECTION_DOWN = new Direction(0, 1);
    public final static Direction DIRECTION_LEFT = new Direction(-1, 0);
    public final static Direction DIRECTION_RIGHT = new Direction(1, 0);

    int x;
    int y;

    public Direction(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public Direction rotate() {
        //noinspection SuspiciousNameCombination
        return new Direction(y, x);
    }

    @Override
    public String toString() {
        return "Direction{" +
                "x=" + x +
                ", y=" + y +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Direction direction = (Direction) o;
        return x == direction.x && y == direction.y;
    }

    @Override
    public int hashCode() {
        int result = x;
        result = 31 * result + y;
        return result;
    }
}
