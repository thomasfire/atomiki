package tomihi.atomiki.repositories;

import org.springframework.data.repository.CrudRepository;
import tomihi.atomiki.models.GameState;

public interface GameRepository extends CrudRepository<GameState, String> {
}
