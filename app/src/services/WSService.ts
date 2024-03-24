import { Client, Message } from '@stomp/stompjs';
import {GAME_TOPIC, NOTIFICATION_TOPIC, WS_GUIDE_URL} from "./API";
import {StompSubscription} from "@stomp/stompjs/src/stomp-subscription";

export class WSService {
    private client: Client;
    private userId: string;
    private notifications: StompSubscription | undefined;
    private game: StompSubscription | undefined;

    constructor(userId: string) {
        this.userId = userId;
        this.client = new Client({
            brokerURL: "ws://" + window.location.host + WS_GUIDE_URL,
            onConnect: _frame => {
                this.notifications = this.client.subscribe(NOTIFICATION_TOPIC + this.userId, (message: Message) => this.onNotification(message));
                this.game = this.client.subscribe(GAME_TOPIC + this.userId, (message: Message) => this.onGame(message));
            },
            onStompError: frame => {
                console.log(frame)
            }
        });
        this.client.activate();
    }

    onNotification(message: Message) {
        console.log(message)
    }

    onGame(message: Message) {
        console.log(message)
    }

}