package tomihi.atomiki.dto;

import lombok.Data;
import tomihi.atomiki.game.CompetitorMarks;
import tomihi.atomiki.game.GameSettings;
import tomihi.atomiki.game.Status;
import tomihi.atomiki.models.CompressedUserGame;
import tomihi.atomiki.models.GameState;

@Data
public class OwnGameStateDTO {
    private CredentialDTO credential;
    private GameSettings gameSettings;
    private CompressedUserGame ownerGame;
    private CompetitorMarks ownerMarks;
    private Boolean ownTurn;
    private Status competitorStatus;
    private Boolean isOwner;

    private OwnGameStateDTO() {}

    public static OwnGameStateDTO fromGameState(GameState gameState, boolean owner) {
        OwnGameStateDTO ownGameStateDTO = new OwnGameStateDTO();
        ownGameStateDTO.setOwnTurn(gameState.getMovesCounter() % 2 == (owner ? 0 : 1));
        ownGameStateDTO.setCredential(new CredentialDTO(owner ? gameState.getOwnerId() : gameState.getCompetitorId(), gameState.getId()));
        ownGameStateDTO.setGameSettings(gameState.getGameSettings());
        ownGameStateDTO.setOwnerGame(owner ? gameState.getOwnerGame() : gameState.getCompetitorGame());
        ownGameStateDTO.setCompetitorStatus(owner ? gameState.getCompetitorGame().getStatus() : gameState.getOwnerGame().getStatus());
        ownGameStateDTO.setIsOwner(owner);
        ownGameStateDTO.setOwnerMarks(owner ? gameState.getCompetitorGame().getCompetitorMarks() : gameState.getOwnerGame().getCompetitorMarks());
        return ownGameStateDTO;
    }
}
