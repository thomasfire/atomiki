import {AtomsMarkDTO} from "./AtomsMarkDTO";
import {GameResults} from "./GameResults";
import {Trace} from "./Trace";

enum NOTIFICATION_TYPES {
    COMPETITOR_SET,
    COMPETITOR_JOINED,
    COMPETITOR_MARKED,
    COMPETITOR_MOVED,
    COMPETITOR_FINISHED,
    OWNER_FINISHED
}

export interface CompetitorNotificationDTO {
    type: NOTIFICATION_TYPES,
    message: string,
    payload: null | AtomsMarkDTO | Trace | GameResults
}