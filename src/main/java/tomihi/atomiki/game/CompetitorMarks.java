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
        if (markedAtoms.contains(coords)) return;
        if (markedAtoms.size() >= maxSize) {
            throw new AtomsOverflowException();
        }
        markedAtoms.add(coords);
    }

    public void removeMark(Coords coords) {
        if (!markedAtoms.contains(coords)) {
            throw new IndexOutOfBoundsException();
        }
        markedAtoms.remove(coords);
    }
}
