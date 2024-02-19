package tomihi.atomiki.game;

public class Void implements Space {
    @Override
    public Direction processDirection(Direction direction) {
        return direction;
    }

    @Override
    public boolean canPlaceAnotherObject() {
        return true;
    }
}
