package tomihi.atomiki.game;

import java.util.ArrayList;
import java.util.List;

public class Field {

    private final static Direction DIRECTION_UP = new Direction(0, -1);
    private final static Direction DIRECTION_DOWN = new Direction(0, 1);
    private final static Direction DIRECTION_LEFT = new Direction(-1, 0);
    private final static Direction DIRECTION_RIGHT = new Direction(1, 0);

    Space[][] field;
    final GameSettings gameSettings;
    int atomsCount = 0;

    public Field(GameSettings gameSettings) {
        this.gameSettings = gameSettings;
        this.field = new Space[gameSettings.getFieldSize()+2][gameSettings.getFieldSize()+2];
        final int fieldEnd = gameSettings.getFieldSize() + 1;
        for (int i = 1; i < fieldEnd; i++) {
            for (int j = 1; j < fieldEnd; j++) {
                this.field[i][j] = new Void();
            }
        }

        for (int i = 1; i < fieldEnd; i++) {
            this.field[0][i] = new Gun(DIRECTION_DOWN);
            this.field[i][0] = new Gun(DIRECTION_RIGHT);
            this.field[fieldEnd][i] = new Gun(DIRECTION_UP);
            this.field[i][fieldEnd] = new Gun(DIRECTION_LEFT);
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
        } else if (atomsCount == gameSettings.getAtomsMaxCount()) {
            throw new AtomsOverflowException();
        } else {
            for (int i = 0; i <= 2; i++) {
                for (int j = 0; j <= 2; j++) {
                    if (!this.field[atomCoords.getX()+i][atomCoords.getY()+j].canPlaceAnotherObject())
                        throw new ImpossibleAtomLocationException("Another atom is too close");
                }
            }
        }

        this.field[atomCoords.getX()+1][atomCoords.getY()+1] = new Atom();
        this.field[atomCoords.getX()+1][atomCoords.getY()] = new Stream(DIRECTION_UP);
        this.field[atomCoords.getX()+1][atomCoords.getY()+2] = new Stream(DIRECTION_DOWN);
        this.field[atomCoords.getX()][atomCoords.getY()+1] = new Stream(DIRECTION_LEFT);
        this.field[atomCoords.getX()+2][atomCoords.getY()+1] = new Stream(DIRECTION_RIGHT);

        this.field[atomCoords.getX()+2][atomCoords.getY()+2] = new AtomShield();
        this.field[atomCoords.getX()][atomCoords.getY()] = new AtomShield();
        this.field[atomCoords.getX()+2][atomCoords.getY()] = new AtomShield();
        this.field[atomCoords.getX()][atomCoords.getY()+2] = new AtomShield();
    }

    // TODO process shooting


}
