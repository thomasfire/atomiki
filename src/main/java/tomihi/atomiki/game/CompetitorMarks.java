package tomihi.atomiki.game;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class CompetitorMarks {
    private Set<Coords> markedAtoms = new HashSet<>();

    private int maxSize;

    public CompetitorMarks(int maxSize) {
        this.maxSize = maxSize;
    }

    public void addMark(Coords coords) throws AtomsOverflowException {
        Coords trueCoords = Field.innerToFullCoords(coords);
        if (markedAtoms.contains(trueCoords)) return;
        if (markedAtoms.size() >= maxSize) {
            throw new AtomsOverflowException();
        }
        markedAtoms.add(trueCoords);
    }

    public void removeMark(Coords coords) {
        Coords trueCoords = Field.innerToFullCoords(coords);
        if (!markedAtoms.contains(trueCoords)) {
            throw new IndexOutOfBoundsException();
        }
        markedAtoms.remove(trueCoords);
    }
}
