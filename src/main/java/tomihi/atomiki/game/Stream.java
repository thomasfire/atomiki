package tomihi.atomiki.game;

import lombok.Getter;
import lombok.Setter;

public class Stream implements Space {

    @Getter
    @Setter
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
    public boolean canPlaceAnotherObject() {
        return false;
    }
}
