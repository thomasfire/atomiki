import {Client, Message, StompSubscription} from '@stomp/stompjs';
import {
    GAME_TOPIC, isHttps,
    NOTIFICATION_TOPIC,
    WS_FINISH,
    WS_GUIDE_URL,
    WS_LOGS,
    WS_MAKE_MOVE,
    WS_MARK_ATOM,
    WS_SET_OWN_ATOMS
} from "./API";
import {
    CompetitorNotificationDTO,
    JSONToCompetitorNotificationDTO,
    NOTIFICATION_TYPES
} from "../types/transport/CompetitorNotificationDTO";
import {GameFn, IWSService, NotificationFn} from "../types/game/page/IWSService";
import {AtomsSetDTO} from "../types/transport/AtomsSetDTO";
import {JSONTOSocketType, SocketTypePayload, SocketTypes, SocketTypesDTO} from "../types/transport/SocketTypes";
import {
    finishGame,
    removeTrace,
    setGuessedOrReal,
    setMarked,
    setOtherFinished,
    setOtherStarted,
    setTrace,
    setTurn,
    startGame
} from "../store/gameSlice";
import {Dispatch} from "@reduxjs/toolkit";
import {AtomsMovementDTO} from "../types/transport/AtomsMovementDTO";
import {AtomsMarkDTO} from "../types/transport/AtomsMarkDTO";
import {LogEntry} from "../types/transport/LogEntry";
import {addToLog, setLog} from "../store/logSlice";
import {Trace} from "../types/transport/Trace";
import {MovesLog} from "../types/transport/MovesLog";
import {GameResults} from "../types/transport/GameResults";
import {setResult} from "../store/resultSlice";
import {NotificationService} from "./NotificationService";
import {ENotificationLevel} from "../types/game/ENotificationLevel";
import {PageService} from "./PageService";


type NotificationSubscriber = {
    [id: string]: NotificationFn
};

type GameSubscriber = {
    [id: string]: GameFn
};

async function delayedExecution(ms_wait: number): Promise<void> {
    return new Promise((resolve, _reject) => setTimeout(() => {
        resolve()
    }, ms_wait));
}

export async function inAsync(callback: ()=>void): Promise<void> {
    return new Promise((resolve, _reject) => {
        callback();
        resolve();
    });
}

function setGuessedAndRealAtoms(payload: AtomsMarkDTO | Trace | GameResults | null, dispatch: Dispatch<any>) {
    const results = payload as GameResults | null;
    if (results) {
        dispatch(setResult(results))
        dispatch(setGuessedOrReal({
            atoms: results.ownerAtoms,
            real: true,
            owner: true,
        }))
        dispatch(setGuessedOrReal({
            atoms: results.ownerGuessedCompetitorAtoms,
            real: false,
            owner: false,
        }))
        dispatch(setGuessedOrReal({
            atoms: results.competitorAtoms,
            real: true,
            owner: false,
        }))
        dispatch(setGuessedOrReal({
            atoms: results.competitorGuessedOwnerAtoms,
            real: false,
            owner: true,
        }))

        PageService.getInstance()?.openResults()
    }
}

export class WSService implements IWSService {
    private static instance: WSService | null;
    private client: Client;
    private readonly userId: string;
    private notifications: StompSubscription | undefined;
    private game: StompSubscription | undefined;
    private notificationSubscribers: Array<NotificationSubscriber> = new Array<NotificationSubscriber>(NOTIFICATION_TYPES.OWNER_FINISHED.valueOf() + 1);
    private gameSubscribers: Array<GameSubscriber> = new Array<GameSubscriber>(SocketTypes.FULL_LOG.valueOf() + 1);

    private constructor(userId: string) {
        this.userId = userId;
        this.client = new Client({
            brokerURL: (isHttps() ? "wss://" : "ws://") + window.location.host + WS_GUIDE_URL,
            onConnect: _frame => {
                this.notifications = this.client.subscribe(NOTIFICATION_TOPIC + this.userId, (message: Message) => this.onNotification(message));
                this.game = this.client.subscribe(GAME_TOPIC + this.userId, (message: Message) => this.onGame(message));
            },
            onStompError: frame => {
                console.warn(frame)
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

    public static init(userId: string) {
        if (!WSService.instance) WSService.instance = new WSService(userId);
    }

    public static getInstance(): WSService | null {
        return WSService.instance;
    }

    public subscribeToNotification(id: string, type: NOTIFICATION_TYPES, callback: NotificationFn) {
        console.log(type)
        this.notificationSubscribers[type][id] = callback;
    }

    public unsubscribeFromNotification(id: string, type: NOTIFICATION_TYPES) {
        delete this.notificationSubscribers[type][id];
    }

    public subscribeToGame(id: string, type: SocketTypes, callback: GameFn) {
        this.gameSubscribers[type][id] = callback;
    }

    public unsubscribeFromGame(id: string, type: SocketTypes) {
        delete this.gameSubscribers[type][id];
    }

    onNotification(message: Message) {
        const notification: CompetitorNotificationDTO = JSONToCompetitorNotificationDTO(message.body);
        console.log(notification)
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
        this.client.publish({
            destination: WS_SET_OWN_ATOMS + this.userId,
            body: JSON.stringify(atomsSet)
        });
    }

    makeMovement(movement: AtomsMovementDTO): void {
        this.client.publish({
            destination: WS_MAKE_MOVE + this.userId,
            body: JSON.stringify(movement)
        });
    }


    public Subscribe(dispatch: Dispatch<any>) {
        this.subscribeToGame("atoms_set", SocketTypes.ATOM_SET, (payload: SocketTypePayload) => {
            const _set = payload as AtomsSetDTO;
            dispatch(startGame(null));
            NotificationService.getInstance()?.emitNotification("Atoms are successfully set", ENotificationLevel.INFO)
        });
        this.subscribeToGame("atoms marked", SocketTypes.ATOM_MARK, (payload: SocketTypePayload) => {
            const _set = payload as AtomsMarkDTO;
        });
        this.subscribeToGame("log entry", SocketTypes.LOG_ENTRY, (payload: SocketTypePayload) => {
            const logEntry = payload as LogEntry;
            dispatch(addToLog(logEntry))
        });
        this.subscribeToGame("full log", SocketTypes.FULL_LOG, (payload: SocketTypePayload) => {
            const movesLog = payload as MovesLog;
            dispatch(setLog(movesLog))
        });

        this.subscribeToNotification("listen to other started", NOTIFICATION_TYPES.COMPETITOR_SET, (_message, _payload) => {
            dispatch(setOtherStarted(null))
            NotificationService.getInstance()?.emitNotification("Competitor set his atoms", ENotificationLevel.INFO)
        });
        this.subscribeToNotification("listen to other moved", NOTIFICATION_TYPES.COMPETITOR_MOVED, (message, payload) => {
            const trace = payload as Trace;
            NotificationService.getInstance()?.emitNotification("Competitor has moved. Now your turn", ENotificationLevel.INFO)
            dispatch(setTrace(trace))
            dispatch(setTurn(true))
            delayedExecution(3000).then(() => {
                dispatch(removeTrace(null))
            })
        });
        this.subscribeToNotification("listen to other marked", NOTIFICATION_TYPES.COMPETITOR_MARKED, (message, payload) => {
            const marking = payload as AtomsMarkDTO;
            dispatch(setMarked(marking))
        });
        this.subscribeToNotification("listen to other finished", NOTIFICATION_TYPES.COMPETITOR_FINISHED, (message, payload) => {
            dispatch(setOtherFinished(null))
            setGuessedAndRealAtoms(payload, dispatch);
            NotificationService.getInstance()?.emitNotification("Competitor has finished his game", ENotificationLevel.INFO)
        });
        this.subscribeToNotification("listen to self finished", NOTIFICATION_TYPES.OWNER_FINISHED, (message, payload) => {
            dispatch(finishGame(null))
            setGuessedAndRealAtoms(payload, dispatch);
            NotificationService.getInstance()?.emitNotification("You have finished his game", ENotificationLevel.INFO)
        });
    }

    finishGame(): void {
        this.client.publish({
            destination: WS_FINISH + this.userId,
            body: ""
        });
    }

    markCompetitorAtom(atom: AtomsMarkDTO): void {
        this.client.publish({
            destination: WS_MARK_ATOM + this.userId,
            body: JSON.stringify(atom)
        });
    }

    requestLogs(): void {
        this.client.publish({
            destination: WS_LOGS + this.userId
        });
    }
}