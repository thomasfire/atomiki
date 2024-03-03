package tomihi.atomiki.game;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Data
public class MovesLog {
    private List<LogEntry> logEntries = new ArrayList<>();

    private Set<Coords> coordsSet = new HashSet<>();

    public MovesLog() {
    }

    public void addToLog(Coords start, Coords end) throws WrongActionForCoords {
        if (coordsSet.contains(start))
            throw new WrongActionForCoords("Already moved");
        logEntries.add(new LogEntry(start, end));
    }

    public boolean hadMoved(Coords coords) {
        return coordsSet.contains(coords);
    }

}
