package tomihi.atomiki.dto;

import lombok.Data;


@Data
public class CredentialDTO {
    private String userId;
    private String gameId;

    public CredentialDTO(String userId, String gameId) {
        this.userId = userId;
        this.gameId = gameId;
    }
}
