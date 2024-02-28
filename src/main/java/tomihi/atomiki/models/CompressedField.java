package tomihi.atomiki.models;

import lombok.Data;
import tomihi.atomiki.game.*;

import java.util.List;

import static tomihi.atomiki.game.GameResults.extractAtomsFromField;


@Data
public class CompressedField {
    private List<Coords> atoms;

    public CompressedField(Field field) {
        this.atoms = extractAtomsFromField(field);
    }

    public Field toField(GameSettings settings) throws ImpossibleAtomLocationException, AtomsOverflowException {
        Field field = new Field(settings);
        for (Coords atom : this.atoms) {
            field.setAtom(Field.fullToInnerCoords(atom));
        }
        return field;
    }
}
