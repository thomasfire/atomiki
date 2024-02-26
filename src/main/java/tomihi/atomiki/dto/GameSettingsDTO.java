package tomihi.atomiki.dto;

import lombok.Data;
import tomihi.atomiki.game.GameSettings;

@Data
public class GameSettingsDTO {
    private CredentialDTO credentials;
    private GameSettings settings;

    public GameSettingsDTO(CredentialDTO credentials, GameSettings settings) {
        this.credentials = credentials;
        this.settings = settings;
    }
}
