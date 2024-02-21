package tomihi.atomiki.game;


public class Field {
    Space[][] field;
    final GameSettings gameSettings;
    private int atomsCount = 0;

    public Field(GameSettings gameSettings) {
        this.gameSettings = gameSettings;
        this.field = new Space[gameSettings.getFieldSize() + 2][gameSettings.getFieldSize() + 2];
        final int fieldEnd = gameSettings.getFieldSize() + 1;
        final int electronTTL = (fieldEnd - 1) * (fieldEnd - 1);
        for (int i = 1; i < fieldEnd; i++) {
            for (int j = 1; j < fieldEnd; j++) {
                this.field[i][j] = new Void();
            }
        }

        for (int i = 1; i < fieldEnd; i++) {
            this.field[0][i] = new Gun(Direction.DIRECTION_DOWN, electronTTL);
            this.field[i][0] = new Gun(Direction.DIRECTION_RIGHT, electronTTL);
            this.field[fieldEnd][i] = new Gun(Direction.DIRECTION_UP, electronTTL);
            this.field[i][fieldEnd] = new Gun(Direction.DIRECTION_LEFT, electronTTL);
        }
    }

    /**
     * Accepts coordinates in shifted way, i.e. stripped from guns.
     */
    public void setAtom(Vector atomCoords) throws ImpossibleAtomLocationException, AtomsOverflowException {
        if (atomCoords.getX() < 0
                || atomCoords.getY() < 0
                || atomCoords.getX() >= this.gameSettings.getFieldSize()
                || atomCoords.getX() >= this.gameSettings.getFieldSize()) {
            throw new ImpossibleAtomLocationException("Coordinates are out of field");
        } else if (atomsCount >= gameSettings.getAtomsMaxCount()) {
            throw new AtomsOverflowException();
        } else {
            for (int i = 0; i <= 2; i++) {
                for (int j = 0; j <= 2; j++) {
                    if (!this.field[atomCoords.getX() + i][atomCoords.getY() + j].canPlaceAnotherObject())
                        throw new ImpossibleAtomLocationException("Another atom is too close");
                }
            }
        }

        atomsCount++;

        this.field[atomCoords.getX() + 1][atomCoords.getY() + 1] = new Atom();
        this.field[atomCoords.getX() + 1][atomCoords.getY()] = new Stream(Direction.DIRECTION_UP);
        this.field[atomCoords.getX() + 1][atomCoords.getY() + 2] = new Stream(Direction.DIRECTION_DOWN);
        this.field[atomCoords.getX()][atomCoords.getY() + 1] = new Stream(Direction.DIRECTION_LEFT);
        this.field[atomCoords.getX() + 2][atomCoords.getY() + 1] = new Stream(Direction.DIRECTION_RIGHT);

        this.field[atomCoords.getX() + 2][atomCoords.getY() + 2] = new AtomShield();
        this.field[atomCoords.getX()][atomCoords.getY()] = new AtomShield();
        this.field[atomCoords.getX() + 2][atomCoords.getY()] = new AtomShield();
        this.field[atomCoords.getX()][atomCoords.getY() + 2] = new AtomShield();
    }

    private Space atCoords(Coords coords) {
        if (coords.getX() < 0 || coords.getX() >= this.field.length ||
                coords.getY() < 0 || coords.getY() >= this.field.length)
            return null;
        return this.field[coords.getX()][coords.getY()];
    }

    /**
     * Accepts coordinates in shifted way, i.e. with -1 or overflown
     */
    public Trace processShoot(Coords shootCords) throws WrongActionForCoords {
        if (shootCords.getX() < -1 || shootCords.getY() < -1
                || shootCords.getX() > this.gameSettings.getFieldSize() + 1
                || shootCords.getY() > this.gameSettings.getFieldSize() + 1) {
            throw new IllegalArgumentException("Coords out of the field");
        }
        Coords coords = new Coords(shootCords.getX() + 1, shootCords.getY() + 1);
        Space gun = this.atCoords(coords);
        // Null pointer exception should be fine here
        Electron electron = gun.createElectron();
        if (electron == null) {
            throw new WrongActionForCoords();
        }

        Trace trace = new Trace();
        trace.addMovement(coords);
        Direction direction = null;
        Space bufferSpace = gun;
        while ((direction = electron.makeMove(bufferSpace)) != Direction.NULL_DIRECTION) {
            coords = coords.addMovement(direction);
            trace.addMovement(coords);
            bufferSpace = this.atCoords(coords);
        }

        return trace;
    }


}
