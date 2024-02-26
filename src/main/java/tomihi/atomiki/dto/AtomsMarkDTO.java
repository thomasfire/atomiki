package tomihi.atomiki.dto;

import lombok.Data;
import tomihi.atomiki.game.Coords;

@Data
public class AtomsMarkDTO {
    private Coords coords;
    boolean mark;
}
