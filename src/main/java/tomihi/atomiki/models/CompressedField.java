package tomihi.atomiki.models;

import lombok.Data;
import tomihi.atomiki.game.*;

import java.util.ArrayList;
import java.util.List;

import static tomihi.atomiki.game.GameResults.extractAtomsFromField;


@Data
public class CompressedField {
    private List<Coords> atoms = new ArrayList<>();
    private int fantomData = 42;

    private CompressedField(Field field) {
        this.atoms = extractAtomsFromField(field);
    }

    public CompressedField() {
    }

    public static CompressedField fromField(Field field) {
        return new CompressedField(field);
    }

    public Field toField(GameSettings settings) throws ImpossibleAtomLocationException, AtomsOverflowException {
        Field field = new Field(settings);
        for (Coords atom : this.atoms) {
            field.setAtom(atom);
        }
        return field;
    }
}
