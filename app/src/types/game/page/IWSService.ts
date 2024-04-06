import {CompetitorNotificationPayload, NOTIFICATION_TYPES} from "../../transport/CompetitorNotificationDTO";
import {AtomsSetDTO} from "../../transport/AtomsSetDTO";
import {SocketTypePayload, SocketTypes} from "../../transport/SocketTypes";
import {AtomsMovementDTO} from "../../transport/AtomsMovementDTO";

export type NotificationFn = (message: string, payload: CompetitorNotificationPayload) => void;
export type GameFn = (payload: SocketTypePayload) => void;
export interface IWSService {
    subscribeToNotification(id: string, type: NOTIFICATION_TYPES, callback: NotificationFn): void;
    unsubscribeFromNotification(id: string, type: NOTIFICATION_TYPES): void;
    subscribeToGame(id: string, type: SocketTypes, callback: GameFn): void;
    unsubscribeFromGame(id: string, type: SocketTypes): void;
    shutdown(): void;
    setOwnAtoms(atomsSet: AtomsSetDTO): void;
    makeMovement(movement: AtomsMovementDTO): void;
}