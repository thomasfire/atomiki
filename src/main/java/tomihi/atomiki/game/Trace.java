package tomihi.atomiki.game;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Trace {
    List<Movement> trace = new ArrayList<>();

    public void addMovement(Movement movement) {
        trace.add(movement);
    }

    public Vector lastPoint() {
        return trace.getLast();
    }
}
