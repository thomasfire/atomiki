package tomihi.atomiki.models;

import lombok.Data;
import tomihi.atomiki.game.LogEntry;
import tomihi.atomiki.game.MovesLog;
import tomihi.atomiki.game.WrongActionForCoords;

import java.util.ArrayList;
import java.util.List;

@Data
public class CompressedMovesLog {
    List<LogEntry> logEntries;

    public CompressedMovesLog(MovesLog movesLog) {
        this.logEntries = movesLog.getLogEntries();
    }

    public MovesLog toMovesLog() throws WrongActionForCoords {
        MovesLog movesLog = new MovesLog();
        for (LogEntry logEntry : this.logEntries) {
            movesLog.addToLog(logEntry.getStartPoint(), logEntry.getEndPoint());
        }
        return movesLog;
    }
}
