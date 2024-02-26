package tomihi.atomiki.repositories;

import org.springframework.data.repository.CrudRepository;
import tomihi.atomiki.models.UserToGame;

public interface UserToGameRepository extends CrudRepository<UserToGame, String> {
}
