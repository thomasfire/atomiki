import {Client, Message} from '@stomp/stompjs';
import {GAME_TOPIC, NOTIFICATION_TOPIC, WS_GUIDE_URL, WS_MAKE_MOVE, WS_SET_OWN_ATOMS} from "./API";
import {StompSubscription} from "@stomp/stompjs/src/stomp-subscription";
import {
    CompetitorNotificationDTO,
    JSONToCompetitorNotificationDTO,
    NOTIFICATION_TYPES
} from "../types/transport/CompetitorNotificationDTO";
import {GameFn, IWSService, NotificationFn} from "../types/game/page/IWSService";
import {AtomsSetDTO} from "../types/transport/AtomsSetDTO";
import {JSONTOSocketType, SocketTypePayload, SocketTypes, SocketTypesDTO} from "../types/transport/SocketTypes";
import {setOtherStarted, startGame} from "../store/gameSlice";
import {Dispatch} from "@reduxjs/toolkit";
import {AtomsMovementDTO} from "../types/transport/AtomsMovementDTO";
import {AtomsMarkDTO} from "../types/transport/AtomsMarkDTO";
import {LogEntry} from "../types/transport/LogEntry";
import {addToLog} from "../store/logSlice";


type NotificationSubscriber = {
    [id: string]: NotificationFn
};

type GameSubscriber = {
    [id: string]: GameFn
};

export class WSService implements IWSService {
    private client: Client;
    private userId: string;
    private notifications: StompSubscription | undefined;
    private game: StompSubscription | undefined;
    private notificationSubscribers: Array<NotificationSubscriber> = new Array<NotificationSubscriber>(NOTIFICATION_TYPES.OWNER_FINISHED.valueOf() + 1);
    private gameSubscribers: Array<GameSubscriber> = new Array<GameSubscriber>(SocketTypes.LOG_ENTRY.valueOf() + 1);

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
        for (let i = 0; i < this.gameSubscribers.length; i++) {
            this.gameSubscribers[i] = {};
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

    public subscribeToGame(id: string, type: SocketTypes, callback: GameFn) {
        console.log(this.gameSubscribers, type.valueOf())
        this.gameSubscribers[type.valueOf()][id] = callback;
    }

    public unsubscribeFromGame(id: string, type: SocketTypes) {
        delete this.gameSubscribers[type.valueOf()][id];
    }

    onNotification(message: Message) {
        const notification: CompetitorNotificationDTO = JSONToCompetitorNotificationDTO(message.body);
        for (const subs of Object.values(this.notificationSubscribers[notification.type])) {
            subs(notification.message, notification.payload);
        }
    }

    onGame(message: Message) {
        const notification: SocketTypesDTO = JSONTOSocketType(message.body);
        for (const subs of Object.values(this.gameSubscribers[notification.type])) {
            subs(notification.payload);
        }
    }

    public shutdown() {
        this.notifications?.unsubscribe();
        this.game?.unsubscribe();
        this.client.deactivate().then(() => console.log("deactivated"));
    }

    public setOwnAtoms(atomsSet: AtomsSetDTO) {
        console.log(this.userId)
        this.client.publish({
            destination: WS_SET_OWN_ATOMS + this.userId,
            body: JSON.stringify(atomsSet)
        });
    }

    makeMovement(movement: AtomsMovementDTO): void {
        console.log(movement)
        this.client.publish({
            destination: WS_MAKE_MOVE + this.userId,
            body: JSON.stringify(movement)
        });
    }


    public Subscribe(dispatch: Dispatch<any>) {
        this.subscribeToGame("atoms_set", SocketTypes.ATOM_SET, (payload: SocketTypePayload) => {
            const set = payload as AtomsSetDTO;
            dispatch(startGame(null));
            console.log(set)
        });
        this.subscribeToGame("atoms marked", SocketTypes.ATOM_MARK, (payload: SocketTypePayload) => {
            const set = payload as AtomsMarkDTO;
            console.log(set)
        });
        this.subscribeToGame("log entry", SocketTypes.LOG_ENTRY, (payload: SocketTypePayload) => {
            const logEntry = payload as LogEntry;
            dispatch(addToLog(logEntry))
            console.log(logEntry)
        });

        this.subscribeToNotification("listen to other started", NOTIFICATION_TYPES.COMPETITOR_SET, (message, payload) => {
            console.log(message, payload)
            dispatch(setOtherStarted(null))
        });
        this.subscribeToNotification("listen to other moved", NOTIFICATION_TYPES.COMPETITOR_MOVED, (message, payload) => {
            console.log(message, payload)
        });
    }
}