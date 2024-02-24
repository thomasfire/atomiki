package tomihi.atomiki.models;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import tomihi.atomiki.game.*;

import java.util.ArrayList;
import java.util.List;


@Data
public class CompressedField {
    private List<Coords> atoms;

    public CompressedField(Field field) {
        this.atoms = new ArrayList<>();

        final Space[][] table = field.getField();

        for (int i = 0; i < table.length; i++) {
            for (int j = 0; j < table[i].length; j++) {
                if (table[i][j].isAtom()) this.atoms.add(new Coords(i, j));
            }
        }
    }

    public Field toField(GameSettings settings) throws ImpossibleAtomLocationException, AtomsOverflowException {
        Field field = new Field(settings);
        for (Coords atom : this.atoms) {
            field.setAtom(Field.fullToInnerCoords(atom));
        }
        return field;
    }
}
