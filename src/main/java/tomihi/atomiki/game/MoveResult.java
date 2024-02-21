package tomihi.atomiki.game;

import lombok.Data;

@Data
public class MoveResult {
    Trace trace;
    boolean lastCoordTraceble;

    public MoveResult(Trace trace, boolean lastCoordTraceble) {
        this.trace = trace;
        this.lastCoordTraceble = lastCoordTraceble;
    }
}
