package tomihi.atomiki.game;

import lombok.Getter;
import lombok.Setter;

public class Gun implements Space {

    private final static Direction NULL_DIRECTION = new Direction(0, 0);

    @Getter
    @Setter
    private Direction direction;

    public Gun(Direction direction) {
        this.direction = direction;
    }

    @Override
    public Direction processDirection(Direction direction) {
        if (NULL_DIRECTION.equals(direction)) {
            return this.direction;
        } else {
            return new Direction(0, 0);
        }
    }

    @Override
    public boolean canRegisterElectronDeath() {
        return true;
    }

    @Override
    public boolean canPlaceAnotherObject() {
        return false;
    }
}
