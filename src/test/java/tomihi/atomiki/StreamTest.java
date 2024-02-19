package tomihi.atomiki;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import tomihi.atomiki.game.Direction;
import tomihi.atomiki.game.Stream;

public class StreamTest {
    final Direction stoppedDirection = new Direction(0, 0);

    @Test
    void testMovementUp() {
        Direction streamDirection = new Direction(0, -1);
        Stream stream = new Stream(streamDirection);
        assertEquals(streamDirection, stream.processDirection(new Direction(1, 0)));
        assertEquals(streamDirection, stream.processDirection(new Direction(-1, 0)));
        assertEquals(this.stoppedDirection, stream.processDirection(new Direction(0, 1)));
        assertEquals(this.stoppedDirection, stream.processDirection(new Direction(0, -1)));
        assertEquals(this.stoppedDirection, stream.processDirection(new Direction(0, 0)));
    }

    @Test
    void testMovementDown() {
        Direction streamDirection = new Direction(0, 1);
        Stream stream = new Stream(streamDirection);
        assertEquals(streamDirection, stream.processDirection(new Direction(1, 0)));
        assertEquals(streamDirection, stream.processDirection(new Direction(-1, 0)));
        assertEquals(this.stoppedDirection, stream.processDirection(new Direction(0, 1)));
        assertEquals(this.stoppedDirection, stream.processDirection(new Direction(0, -1)));
        assertEquals(this.stoppedDirection, stream.processDirection(new Direction(0, 0)));
    }

    @Test
    void testMovementLeft() {
        Direction streamDirection = new Direction(-1, 0);
        Stream stream = new Stream(streamDirection);
        assertEquals(streamDirection, stream.processDirection(new Direction(0, 1)));
        assertEquals(streamDirection, stream.processDirection(new Direction(0, -1)));
        assertEquals(this.stoppedDirection, stream.processDirection(new Direction(1, 0)));
        assertEquals(this.stoppedDirection, stream.processDirection(new Direction(-1, 0)));
        assertEquals(this.stoppedDirection, stream.processDirection(new Direction(0, 0)));
    }

    @Test
    void testMovementRight() {
        Direction streamDirection = new Direction(1, 0);
        Stream stream = new Stream(streamDirection);
        assertEquals(streamDirection, stream.processDirection(new Direction(0, 1)));
        assertEquals(streamDirection, stream.processDirection(new Direction(0, -1)));
        assertEquals(this.stoppedDirection, stream.processDirection(new Direction(1, 0)));
        assertEquals(this.stoppedDirection, stream.processDirection(new Direction(-1, 0)));
        assertEquals(this.stoppedDirection, stream.processDirection(new Direction(0, 0)));
    }

}
