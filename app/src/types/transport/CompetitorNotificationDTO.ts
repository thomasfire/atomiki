import {AtomsMarkDTO} from "./AtomsMarkDTO";
import {GameResults} from "./GameResults";
import {Trace} from "./Trace";

export enum NOTIFICATION_TYPES {
    COMPETITOR_SET = 0,
    COMPETITOR_JOINED = 1,
    COMPETITOR_MARKED = 2,
    COMPETITOR_MOVED = 3,
    COMPETITOR_FINISHED = 4,
    OWNER_FINISHED = 5
}

export interface CompetitorNotificationDTO {
    type: NOTIFICATION_TYPES,
    message: string,
    payload: null | AtomsMarkDTO | Trace | GameResults
}

export function JSONToCompetitorNotificationDTO(json: string): CompetitorNotificationDTO {
    const {message, payload, type}: {
        type: "COMPETITOR_SET" | "COMPETITOR_JOINED" | "COMPETITOR_MARKED" | "COMPETITOR_MOVED" | "COMPETITOR_FINISHED" | "OWNER_FINISHED",
        message: string,
        payload: null | AtomsMarkDTO | Trace | GameResults
    } = JSON.parse(json);
    return {
        message: message, payload: payload,
        type: NOTIFICATION_TYPES[type]
    }
}