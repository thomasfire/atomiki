package tomihi.atomiki.game;

import lombok.Getter;
import lombok.Setter;

public class Gun implements Space {
    @Getter
    @Setter
    private Direction direction;

    @Getter
    private int ttl;

    public Gun(Direction direction, int ttl) {
        this.direction = direction;
        this.ttl = ttl;
    }

    @Override
    public Direction processDirection(Direction direction) {
        if (Direction.NULL_DIRECTION.equals(direction)) {
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

    @Override
    public Electron createElectron() {
        return new Electron(this.ttl);
    }
}
