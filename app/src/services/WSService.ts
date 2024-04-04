import { Client, Message } from '@stomp/stompjs';
import {GAME_TOPIC, NOTIFICATION_TOPIC, WS_GUIDE_URL} from "./API";
import {StompSubscription} from "@stomp/stompjs/src/stomp-subscription";
import {
    CompetitorNotificationDTO,
    JSONToCompetitorNotificationDTO,
    NOTIFICATION_TYPES
} from "../types/transport/CompetitorNotificationDTO";
import {IWSService, NotificationFn} from "../types/game/page/IWSService";


type Subscriber = {
    [id: string]:  NotificationFn
};

export class WSService implements IWSService{
    private client: Client;
    private userId: string;
    private notifications: StompSubscription | undefined;
    private game: StompSubscription | undefined;
    private notificationSubscribers: Array<Subscriber> = new Array<Subscriber>(NOTIFICATION_TYPES.OWNER_FINISHED.valueOf() + 1);

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
        for (let i = 0; i < this.notificationSubscribers.length; i++) {
            this.notificationSubscribers[i] = {};
        }
        this.client.activate();
    }

    public subscribeToNotification(id: string, type: NOTIFICATION_TYPES, callback: NotificationFn) {
        console.log(this.notificationSubscribers, type.valueOf())
        this.notificationSubscribers[type.valueOf()][id] = callback;
    }

    public unsubscribeFromNotification(id: string, type: NOTIFICATION_TYPES) {
        delete this.notificationSubscribers[type.valueOf()][id];
    }

    onNotification(message: Message) {
        const notification: CompetitorNotificationDTO = JSONToCompetitorNotificationDTO(message.body);
        for (const subs of Object.values(this.notificationSubscribers[notification.type])) {
            subs(notification.message, notification.payload);
        }
    }

    onGame(message: Message) {
        // TODO
        console.log(message)
    }

    shutdown() {
        this.notifications?.unsubscribe();
        this.game?.unsubscribe();
        this.client.deactivate().then(() => console.log("deactivated"));
    }
}