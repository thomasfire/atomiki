package tomihi.atomiki.game;

public class Atom implements Space {
    @Override
    public Direction processDirection(Direction direction) {
        return new Direction(0, 0);
    }

    @Override
    public boolean canPlaceAnotherObject(Space other) {
        return other == null;
    }

    @Override
    public boolean isAtom() {
        return true;
    }

    @Override
    public String toString() {
        return "Atom{}";
    }
}
