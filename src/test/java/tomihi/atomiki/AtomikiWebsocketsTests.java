package tomihi.atomiki;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;
import tomihi.atomiki.dto.CredentialDTO;
import tomihi.atomiki.dto.GameSettingsDTO;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

import static java.util.concurrent.TimeUnit.SECONDS;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
public class AtomikiWebsocketsTests {
    private WebSocketStompClient webSocketStompClient;
    private StompSession session;

    @LocalServerPort
    private Integer port;

    @Autowired
    private WebTestClient client;
    private String ownerId;
    private String competitorId;
    private String gameId;


    @BeforeEach
    void setup() throws ExecutionException, InterruptedException, TimeoutException {
        this.webSocketStompClient = new WebSocketStompClient(new SockJsClient(List.of(new WebSocketTransport(new StandardWebSocketClient()))));
        //this.client = WebTestClient.bindToServer().baseUrl("http://localhost:8080").build();

        CredentialDTO credentialDTO = this.client.post()
                .uri("/create")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentType(MediaType.APPLICATION_JSON)
                .expectBody(CredentialDTO.class)
                .returnResult().getResponseBody();

        this.ownerId = credentialDTO.getUserId();
        this.gameId = credentialDTO.getGameId();

        GameSettingsDTO competitorSettingsDTO = this.client.get()
                .uri("/join/" + this.gameId)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentType(MediaType.APPLICATION_JSON)
                .expectBody(GameSettingsDTO.class)
                .returnResult().getResponseBody();

        this.competitorId = competitorSettingsDTO.getCredentials().getUserId();

        this.session = webSocketStompClient
                .connectAsync(String.format("ws://localhost:%d/ws-guide", this.port), new StompSessionHandlerAdapter() {
                })
                .get(1, SECONDS);


    }

    @Test
    void testSession() {
        System.out.println(this.gameId);
        System.out.println(this.ownerId);
        System.out.println(this.competitorId);
        Assertions.assertNotNull(this.session.getSessionId());
        Assertions.assertNotNull(this.gameId);
        Assertions.assertNotNull(this.ownerId);
        Assertions.assertNotNull(this.competitorId);
    }


}
