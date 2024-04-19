package tomihi.atomiki.game;


import lombok.Getter;

public class Field {
    @Getter
    Space[][] field;
    final GameSettings gameSettings;
    private int atomsCount = 0;

    final private static Space[][] ATOM_STRUCTURE = new Space[][]{
                        // y = 0            y = 1                               y = 2
            new Space[]{null, new Stream(Direction.DIRECTION_LEFT), null}, // x = 0
            new Space[]{new Stream(Direction.DIRECTION_UP), new Atom(), new Stream(Direction.DIRECTION_DOWN)}, // x = 1
            new Space[]{null, new Stream(Direction.DIRECTION_RIGHT), null}, // x = 2
    };


    public Field(GameSettings gameSettings) {
        this.gameSettings = gameSettings;
        this.field = new Space[gameSettings.getFieldSize() + 2][gameSettings.getFieldSize() + 2];
        final int fieldEnd = gameSettings.getFieldSize() + 1;
        final int electronTTL = (fieldEnd - 1) * (fieldEnd - 1);
        for (int i = 1; i < fieldEnd; i++) {
            for (int j = 1; j < fieldEnd; j++) {
                this.setAtCoords(i, j, new Void());
            }
        }

        for (int i = 1; i < fieldEnd; i++) {
            this.setAtCoords(0, i,  new Gun(Direction.DIRECTION_RIGHT, electronTTL));
            this.setAtCoords(i, 0,  new Gun(Direction.DIRECTION_DOWN, electronTTL));
            this.setAtCoords(fieldEnd, i,  new Gun(Direction.DIRECTION_LEFT, electronTTL));
            this.setAtCoords(i, fieldEnd,  new Gun(Direction.DIRECTION_UP, electronTTL));
        }
    }

    /**
     * Accepts coordinates in inner way, i.e. stripped from guns.
     */
    public void setAtom(Coords atomCoords) throws ImpossibleAtomLocationException, AtomsOverflowException {
        if (atomCoords.getX() < 0
                || atomCoords.getY() < 0
                || atomCoords.getX() >= this.gameSettings.getFieldSize()
                || atomCoords.getY() >= this.gameSettings.getFieldSize()) {
            throw new ImpossibleAtomLocationException("Coordinates are out of field");
        } else if (atomsCount >= gameSettings.getAtomsMaxCount()) {
            throw new AtomsOverflowException();
        }
        for (int i = 0; i <= 2; i++) {
            for (int j = 0; j <= 2; j++) {
                if (!this.atCoords(atomCoords.addMovement(new Direction(i, j))).canPlaceAnotherObject(ATOM_STRUCTURE[i][j]))
                    throw new ImpossibleAtomLocationException(String.format("Another atom is too close, existing: %d:%d, %d:%d",
                            i, j, atomCoords.getX(), atomCoords.getY()));
            }
        }

        atomsCount++;

        for (int i = 0; i <= 2; i++) {
            for (int j = 0; j <= 2; j++) {
                this.setAtCoords(atomCoords.addMovement(new Direction(i, j)), ATOM_STRUCTURE[i][j]);
            }
        }
    }

    private boolean isOutOfField(Coords coords) {
        return coords.getX() < 0 || coords.getX() >= this.field.length ||
                coords.getY() < 0 || coords.getY() >= this.field.length;
    }

    private Space atCoords(Coords coords) {
        if (isOutOfField(coords))
            return null;
        return this.field[coords.getX()][coords.getY()];
    }

    private void setAtCoords(Coords coords, Space space) {
        if (isOutOfField(coords))
            throw new IndexOutOfBoundsException();
        if (space != null)
            this.field[coords.getX()][coords.getY()] = space;
    }

    private void setAtCoords(int x, int y, Space space) {
        this.field[x][y] = space;
    }

    /**
     * Accepts coordinates in shifted way, i.e. with -1 or overflown
     */
    public MoveResult processShoot(Coords shootCords) throws WrongActionForCoords {
        if (shootCords.getX() < -1 || shootCords.getY() < -1
                || shootCords.getX() > this.gameSettings.getFieldSize() + 1
                || shootCords.getY() > this.gameSettings.getFieldSize() + 1) {
            throw new IllegalArgumentException("Coords out of the field");
        }
        Coords coords = innerToFullCoords(shootCords);
        Gun gun = (Gun) this.atCoords(coords);
        // Null pointer exception should be fine here
        Electron electron = gun.createElectron();
        if (electron == null) {
            throw new WrongActionForCoords();
        }

        Trace trace = new Trace();
        trace.addMovement(fullToInnerCoords(coords));
        Direction direction;
        Space bufferSpace = gun;
        while (!(direction = electron.makeMove(bufferSpace)).equals(Direction.NULL_DIRECTION)) {
            coords = coords.addMovement(direction);
            trace.addMovement(fullToInnerCoords(coords));
            bufferSpace = this.atCoords(coords);
        }

        return new MoveResult(trace, this.atCoords(coords).canRegisterElectronDeath());
    }

    public static Coords fullToInnerCoords(Coords coords) {
        return new Coords(coords.getX() - 1, coords.getY() - 1);
    }

    public static Coords innerToFullCoords(Coords coords) {
        return new Coords(coords.getX() + 1, coords.getY() + 1);
    }

}
