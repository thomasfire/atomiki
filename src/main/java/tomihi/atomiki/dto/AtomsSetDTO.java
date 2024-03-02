package tomihi.atomiki.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tomihi.atomiki.game.Coords;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AtomsSetDTO implements Serializable {
    private List<Coords> coordsList;
}
