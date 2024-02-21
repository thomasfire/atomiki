package tomihi.atomiki.game;

import lombok.Data;
import lombok.NonNull;


@Data
public class LogEntry {
    @NonNull
    Coords startPoint;
    Coords endPoint;

    public LogEntry(@NonNull Coords startPoint, Coords endPoint) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }
}
