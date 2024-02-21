package tomihi.atomiki.game;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Trace {
    private List<Coords> trace = new ArrayList<>();

    public void addMovement(Coords movement) {
        trace.add(movement);
    }

    public Coords lastPoint() {
        return trace.getLast();
    }
}
