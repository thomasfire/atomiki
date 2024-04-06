package tomihi.atomiki.game;

public class AtomShield extends Void {
    @Override
    public boolean canPlaceAnotherObject(Space other) {
        return !other.isAtom();
    }

    @Override
    public boolean isAtomShield() {
        return true;
    }
}
