import {Client, Message, StompSubscription} from '@stomp/stompjs';
import {
    GAME_TOPIC,
    NOTIFICATION_TOPIC,
    WS_FINISH,
    WS_GUIDE_URL, WS_LOGS,
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
    removeTrace, setGuessedOrReal,
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
import {openPage} from "../store/pageSlice";
import {EPage} from "../types/game/page/EPage";
import {setResult} from "../store/resultSlice";


type NotificationSubscriber = {
    [id: string]: NotificationFn
};

type GameSubscriber = {
    [id: string]: GameFn
};

async function delayedExecution(ms_wait: number) {
    return new Promise((resolve, _reject) => setTimeout(() => {
        resolve("done")
    }, ms_wait));
}

function setGuessedAndRealAtoms(payload: AtomsMarkDTO | Trace | GameResults | null, dispatch: Dispatch<any>) {
    const results = payload as GameResults | null;
    if (results) {
        console.log(results)
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

        dispatch(openPage(EPage.ResultPage))
    }
}

export class WSService implements IWSService {
    private client: Client;
    private readonly userId: string;
    private notifications: StompSubscription | undefined;
    private game: StompSubscription | undefined;
    private notificationSubscribers: Array<NotificationSubscriber> = new Array<NotificationSubscriber>(NOTIFICATION_TYPES.OWNER_FINISHED.valueOf() + 1);
    private gameSubscribers: Array<GameSubscriber> = new Array<GameSubscriber>(SocketTypes.FULL_LOG.valueOf() + 1);

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
        this.subscribeToGame("full log", SocketTypes.FULL_LOG, (payload: SocketTypePayload) => {
            const movesLog = payload as MovesLog;
            dispatch(setLog(movesLog))
            console.log(movesLog)
        });

        this.subscribeToNotification("listen to other started", NOTIFICATION_TYPES.COMPETITOR_SET, (message, payload) => {
            console.log(message, payload)
            dispatch(setOtherStarted(null))
        });
        this.subscribeToNotification("listen to other moved", NOTIFICATION_TYPES.COMPETITOR_MOVED, (message, payload) => {
            console.log(message, payload)
            const trace = payload as Trace;
            dispatch(setTrace(trace))
            dispatch(setTurn(true))
            delayedExecution(3000).then(()=> {
                dispatch(removeTrace(null))
            })
        });
        this.subscribeToNotification("listen to other marked", NOTIFICATION_TYPES.COMPETITOR_MARKED, (message, payload) => {
            console.log(message, payload)
            const marking = payload as AtomsMarkDTO;
            dispatch(setMarked(marking))
        });
        this.subscribeToNotification("listen to other finished", NOTIFICATION_TYPES.COMPETITOR_FINISHED, (message, payload) => {
            console.log(message, payload)
            dispatch(setOtherFinished(null))
            setGuessedAndRealAtoms(payload, dispatch);
        });
        this.subscribeToNotification("listen to self finished", NOTIFICATION_TYPES.OWNER_FINISHED, (message, payload) => {
            console.log(message, payload)
            dispatch(finishGame(null))
            setGuessedAndRealAtoms(payload, dispatch);
        });
    }

    finishGame(): void {
        console.log("finish")
        this.client.publish({
            destination: WS_FINISH + this.userId,
            body: ""
        });
    }

    markCompetitorAtom(atom: AtomsMarkDTO): void {
        console.log(atom)
        this.client.publish({
            destination: WS_MARK_ATOM + this.userId,
            body: JSON.stringify(atom)
        });
    }

    requestLogs(): void {
        console.log("requestLogs")
        this.client.publish({
            destination: WS_LOGS + this.userId
        });
    }
}