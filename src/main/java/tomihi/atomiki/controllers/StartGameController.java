package tomihi.atomiki.controllers;

import org.springframework.web.bind.annotation.*;
import tomihi.atomiki.dto.CredentialDTO;
import tomihi.atomiki.dto.GameSettingsDTO;


@RestController
@RequestMapping("/")
public class StartGameController {
    // there should be repositories and constructor


    @PostMapping("/create")
    public CredentialDTO createNewGame() {
        // This method should just generate new credentials and put them into repo
        return null;
    }

    @GetMapping("/join/{gameId}")
    public GameSettingsDTO joinNewGame(@PathVariable String gameId) {
        // This method should verify game id and that there is no second user already, and return game settings
        // which include the credential
        return null;
    }

    @GetMapping("/login/{userId}/{gameId}")
    public GameSettingsDTO loginExistingGame(@PathVariable String userId, @PathVariable String gameId) {
        // This method should verify game id and that the game is ongoing, and return game settings
        // which include the credential. This method is used on connection interruptions.
        // All the game log stuff will be in websocket service
        return null;
    }

    @PostMapping("/set")
    public GameSettingsDTO setSettings(@RequestBody GameSettingsDTO gameSettingsDTO) {
        // This method should verify and save settings from user and set the game to be set
        return null;
    }
}
