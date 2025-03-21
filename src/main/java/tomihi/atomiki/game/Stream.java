package tomihi.atomiki.game;

import lombok.Data;

@Data
public class Stream implements Space {
    private Direction direction;

    public Stream(Direction direction) {
        this.direction = direction;
    }

    @Override
    public Direction processDirection(Direction electronDirection) {
        Direction rotated = electronDirection.rotate();
        return new Direction(((this.direction.getX() != 0 && rotated.getX() != 0) ? this.direction.getX() : 0),
                ((this.direction.getY() != 0 && rotated.getY() != 0) ? this.direction.getY() : 0));
    }

    @Override
    public boolean canPlaceAnotherObject(Space other) {
        return other == null;
    }

    @Override
    public String toString() {
        return "Stream{" +
                "direction=" + direction +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Stream stream = (Stream) o;
        return direction.equals(stream.direction);
    }

    @Override
    public int hashCode() {
        return direction.hashCode();
    }
}
