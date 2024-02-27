package tomihi.atomiki.dto;

import lombok.Data;
import tomihi.atomiki.game.Coords;

import java.util.List;

@Data
public class AtomsSetDTO {
    private List<Coords> coordsList;
}
