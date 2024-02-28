package tomihi.atomiki.game;

public interface Space {
    Direction processDirection(Direction direction);

    default boolean canRegisterElectronDeath() {
        return false;
    }
    default boolean isAtom() {
        return false;
    }

    default Electron createElectron() {
        return null;
    }

    boolean canPlaceAnotherObject();
}
