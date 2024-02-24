package tomihi.atomiki.models;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.redis.core.RedisHash;

@Data
@RedisHash("UserToGame")
public class UserToGame {
    @Id
    private User id;
    private String gameId;
}
