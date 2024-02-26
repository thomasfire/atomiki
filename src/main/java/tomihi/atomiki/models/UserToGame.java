package tomihi.atomiki.models;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.redis.core.RedisHash;

@Data
@RedisHash("UserToGame")
public class UserToGame {
    @Id
    private String id;
    private String gameId;

    public UserToGame(String id, String gameId) {
        this.id = id;
        this.gameId = gameId;
    }
}
