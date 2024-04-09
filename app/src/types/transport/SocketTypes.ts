import {AtomsMarkDTO} from "./AtomsMarkDTO";
import {AtomsSetDTO} from "./AtomsSetDTO";
import {LogEntry} from "./LogEntry";
import {MovesLog} from "./MovesLog";

export enum SocketTypes {
    ATOM_MARK,
    ATOM_SET,
    LOG_ENTRY,
    FULL_LOG
}

export type SocketTypePayload = AtomsMarkDTO | AtomsSetDTO | LogEntry | MovesLog;

export interface SocketTypesDTO {
    type: SocketTypes,
    payload: SocketTypePayload
}


export function JSONTOSocketType(data: string): SocketTypesDTO {
    const {payload, type}: {
        type: "ATOM_MARK" | "ATOM_SET" | "LOG_ENTRY" | "FULL_LOG",
        payload: SocketTypePayload
    } = JSON.parse(data);
    return {
        payload: payload,
        type: SocketTypes[type]
    }
}