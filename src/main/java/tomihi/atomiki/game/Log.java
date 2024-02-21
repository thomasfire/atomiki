package tomihi.atomiki.game;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Data
public class Log {
    List<LogEntry> logEntries = new ArrayList<>();

    Set<Coords> coordsSet = new HashSet<>();

    public void addToLog(Coords start, Coords end) throws WrongActionForCoords {
        if (coordsSet.contains(start))
            throw new WrongActionForCoords("Already moved");
        logEntries.add(new LogEntry(start, end));

    }

    public boolean hadMoved(Coords coords) {
        return coordsSet.contains(coords);
    }

}
