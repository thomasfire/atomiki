import {NOTIFICATION_TYPES} from "../../transport/CompetitorNotificationDTO";
import {AtomsMarkDTO} from "../../transport/AtomsMarkDTO";
import {Trace} from "../../transport/Trace";
import {GameResults} from "../../transport/GameResults";

export type NotificationFn = (message: string, payload: null | AtomsMarkDTO | Trace | GameResults) => void;
export interface IWSService {
    subscribeToNotification(id: string, type: NOTIFICATION_TYPES, callback: NotificationFn): void;
    unsubscribeFromNotification(id: string, type: NOTIFICATION_TYPES): void;
    shutdown(): void;
}