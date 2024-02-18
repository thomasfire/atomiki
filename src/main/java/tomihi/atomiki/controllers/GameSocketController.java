package tomihi.atomiki.controllers;


import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import tomihi.atomiki.dto.AtomsMarkDTO;
import tomihi.atomiki.dto.AtomsMovementDTO;
import tomihi.atomiki.dto.AtomsSetDTO;

// This controller should be responsible for the websocket process in the game
@Controller
public class GameSocketController {
    @MessageMapping("/set-own-atoms/{userId}")
    public void setOwnAtoms(@Payload AtomsSetDTO atomsSetDTO, @Header String userId) throws Exception {
        // Verifies userID exists, there is no other atoms, verifies game not started, verifies atoms constraints,
        // saves atoms to the db, sends to owner confirmation (same atoms), sends notification to other user
    }

    @MessageMapping("/make-move/{userId}")
    public void makeMovement(@Payload AtomsMovementDTO atomsMovementDTO, @Header String userId) throws Exception {
        // Verifies:  userID exists, game started, has right to move, no such movement before,
        // processes movement in the game engine, saves to the db and sends the result to the owner, and trace to the competitor
    }

    @MessageMapping("/mark-atom/{userId}")
    public void markCompetitorAtom(@Payload AtomsMarkDTO atomsMovementDTO, @Header String userId) throws Exception {
        // Verifies:  userID exists, game started, no such mark before, not finished
        // processes mark in the game engine, saves to the db and sends the result to the owner, and trace to the competitor
    }

    @MessageMapping("/finish/{userId}")
    public void finishGame(@Header String userId) throws Exception {
        // Verifies:  userID exists, game started, owner not finished before
        // processes in the game engine, saves to the db, and sends the result to the owner, and notification to the competitor
        // may give the competitor right to move, if it is even.
    }

    @MessageMapping("/logs/{userId}")
    public void getLogs(@Header String userId) throws Exception {
        // Verifies:  userID exists, game started, owner not finished before
        // gets movements from db and forms logs and sends to owner
    }

    // also error handler somewhere here

}
