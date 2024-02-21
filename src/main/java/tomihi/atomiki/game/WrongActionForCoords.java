package tomihi.atomiki.game;

public class WrongActionForCoords extends Exception {
    public WrongActionForCoords() {
    }

    public WrongActionForCoords(String message) {
        super(message);
    }
}
