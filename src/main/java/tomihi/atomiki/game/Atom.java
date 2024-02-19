package tomihi.atomiki.game;

public class Atom implements Space {
    @Override
    public Direction processDirection(Direction direction) {
        return new Direction(0, 0);
    }

    @Override
    public boolean canPlaceAnotherObject() {
        return false;
    }
}
