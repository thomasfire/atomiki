package tomihi.atomiki.game;

public interface Space {
    Direction processDirection(Direction direction);

    default boolean canRegisterElectronDeath() {
        return false;
    };

    boolean canPlaceAnotherObject();
}
