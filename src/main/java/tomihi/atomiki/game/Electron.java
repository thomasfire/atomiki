package tomihi.atomiki.game;


import lombok.Getter;

@Getter
public class Electron {
    private Direction direction;

    private int ttl;

    public Electron(int ttl) {
        this.direction = Direction.NULL_DIRECTION;
        this.ttl = ttl;
    }

    public Direction makeMove(Space space) {
        if (this.ttl <= 0)
            return Direction.NULL_DIRECTION;

        Direction newDirection = space.processDirection(this.direction);
        this.direction = newDirection;
        ttl--;
        return newDirection;
    }

}
