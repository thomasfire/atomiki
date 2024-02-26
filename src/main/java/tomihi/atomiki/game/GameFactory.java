package tomihi.atomiki.game;

public class GameFactory {
    public final static GameSettings[] VARIANTS = new GameSettings[]{
            new GameSettings(12, 6),
            new GameSettings(10, 5),
            new GameSettings(8, 4),
            new GameSettings(6, 3),
    };

    public Game createGameWithSettingsId(int id) {
        if (id < 0 || id >= VARIANTS.length) throw new IllegalArgumentException();

        return new Game(VARIANTS[id]);
    }

    public static boolean isValidSettings(GameSettings gameSettings) {
        for (GameSettings settings : VARIANTS) {
            if (settings.equals(gameSettings)) return true;
        }
        return false;
    }
}
