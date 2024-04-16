import {createSlice, Slice} from "@reduxjs/toolkit";
import {GameState} from "../types/game/page/GameState";
import {GameSettings} from "../types/transport/GameSettings";
import {FieldData} from "../types/game/view/FieldData";
import {Vector} from "../types/transport/Vector";
import {Trace} from "../types/transport/Trace";
import {AtomsMarkDTO} from "../types/transport/AtomsMarkDTO";
import {NotificationService} from "../services/NotificationService";
import {ENotificationLevel} from "../types/game/ENotificationLevel";
import {inAsync, WSService} from "../services/WSService";

export const gameSlice: Slice = createSlice({
    name: 'join',
    initialState: {
        ownerField: null,
        competitorField: null,
        gameStarted: false,
        gameFinished: false,
        otherStarted: false,
        otherFinished: false,
        ownerTurn: false,
        isOwner: false,
    },
    reducers: {
        initializeGame: (state: GameState, action: { payload: GameSettings, type: string }) => {
            state.ownerField = FieldData.emptyField(action.payload);
            state.competitorField = FieldData.emptyField(action.payload);
        },
        startGame: (state: GameState) => {
            if (!state.gameStarted)
                state.gameStarted = true;
            else {
                console.warn("Cannot start the game again")
                NotificationService.getInstance()?.emitNotification("Cannot start the game again", ENotificationLevel.WARNING)
            }
        },
        finishGame: (state: GameState) => {
            if (!state.gameFinished && state.gameStarted)
                state.gameFinished = true;
            else {
                console.warn("Cannot finish the game again")
                NotificationService.getInstance()?.emitNotification("Cannot finish the game again", ENotificationLevel.WARNING)
            }
        },
        setOtherStarted: (state: GameState) => {
            state.otherStarted = true;
        },
        setOtherFinished: (state: GameState) => {
            state.otherFinished = true;
        },
        setOwnAtom: (state: GameState, action: { payload: Vector, type: string }) => {
            if (!state.gameStarted) {
                try {
                    let copy = state.ownerField ? FieldData.clone(state.ownerField) : null;
                    copy?.setAtom(action.payload)
                    state.ownerField = copy;
                } catch (e: any) {
                    console.warn(e)
                    NotificationService.getInstance()?.emitNotification(e.toString(), ENotificationLevel.WARNING)
                }
            } else {
                console.warn("Cannot set own atoms when game is started")
                NotificationService.getInstance()?.emitNotification("Cannot set own atoms when game is started", ENotificationLevel.WARNING)
            }
        },
        setCompetitorAtom: (state: GameState, action: { payload: Vector, type: string }) => {
            if (!state.gameFinished && state.gameStarted) {
                try {
                    let copy = state.competitorField ? FieldData.clone(state.competitorField) : null;
                    copy?.setAtom(action.payload)
                    state.competitorField = copy;
                    inAsync(() => {
                        WSService.getInstance()?.markCompetitorAtom({
                            mark: true,
                            coords: {x: action.payload.x - 1, y: action.payload.y - 1}
                        })
                    })
                } catch (e: any) {
                    console.warn(e)
                    NotificationService.getInstance()?.emitNotification(e.toString(), ENotificationLevel.WARNING)
                }
            } else {
                console.warn("Cannot set competitor atoms when game is not started or finished")
                NotificationService.getInstance()?.emitNotification("Cannot set competitor atoms when game is not started or finished", ENotificationLevel.WARNING)
            }
        },

        unsetOwnAtom: (state: GameState, action: { payload: Vector, type: string }) => {
            if (!state.gameStarted) {
                let copy = state.ownerField ? FieldData.clone(state.ownerField) : null;
                copy?.unsetAtom(action.payload)
                state.ownerField = copy;
            } else {
                console.warn("Cannot unset own atoms when game is started")
                NotificationService.getInstance()?.emitNotification("Cannot unset own atoms when game is started", ENotificationLevel.WARNING)
            }
        },
        unsetCompetitorAtom: (state: GameState, action: { payload: Vector, type: string }) => {
            if (!state.gameFinished && state.gameStarted) {
                try {
                    let copy = state.competitorField ? FieldData.clone(state.competitorField) : null;
                    copy?.unsetAtom(action.payload)
                    state.competitorField = copy;
                    inAsync(() => {
                        WSService.getInstance()?.markCompetitorAtom({
                            mark: false,
                            coords: {x: action.payload.x - 1, y: action.payload.y - 1}
                        })
                    })
                } catch (e: any) {
                    console.warn(e)
                    NotificationService.getInstance()?.emitNotification(e.toString(), ENotificationLevel.WARNING)
                }
            } else {
                console.warn("Cannot unset competitor atoms when game is not started or finished")
                NotificationService.getInstance()?.emitNotification("Cannot unset competitor atoms when game is not started or finished", ENotificationLevel.WARNING)
            }
        },

        setTrace: (state: GameState, action: { payload: Trace, type: string }) => {
            if (state.ownerField) {
                let cloned = FieldData.clone(state.ownerField);
                cloned.setTrace(action.payload);
                state.ownerField = cloned;
            }
        },
        removeTrace: (state: GameState) => {
            if (state.ownerField) {
                let cloned = FieldData.clone(state.ownerField);
                cloned.removeTrace();
                state.ownerField = cloned;
            }
        },
        setTurn: (state: GameState, action: { payload: boolean, type: string }) => {
            state.ownerTurn = action.payload;
        },
        makeMovement: (state: GameState, action: { payload: Vector, type: string }) => {
            const cell = state.competitorField?.cells[action.payload.x][action.payload.y];
            if (!state.ownerTurn) {
                NotificationService.getInstance()?.emitNotification("Not your turn", ENotificationLevel.WARNING)
            } else if (cell && cell.used) {
                NotificationService.getInstance()?.emitNotification("Same gun cannot shoot twice", ENotificationLevel.WARNING)
            } else if (state.competitorField && cell) {
                state.ownerTurn = false;
                let cloned = FieldData.clone(state.competitorField);
                cloned.cells[action.payload.x][action.payload.y].used = true;
                state.competitorField = cloned;
                inAsync(() => {
                    WSService.getInstance()?.makeMovement({
                        coords: {
                            x: action.payload.x - 1,
                            y: action.payload.y - 1
                        }
                    })
                })
            } else {
                console.error("Cell is null", cell)
            }
        },
        setMarked: (state: GameState, action: { payload: AtomsMarkDTO, type: string }) => {
            if (state.ownerField) {
                let cloned = FieldData.clone(state.ownerField);
                cloned.markAtom(action.payload)
                state.ownerField = cloned;
            }
        },
        setOwner: (state: GameState, action: { payload: boolean, type: string }) => {
            state.isOwner = action.payload;
        },
        setOwnerGuessed: (state: GameState, action: { payload: Vector[], type: string }) => {
            if (state.ownerField) {
                let cloned = FieldData.clone(state.ownerField);
                cloned.markGuessed(action.payload)
                state.ownerField = cloned;
            }
        },
        setGuessedOrReal: (state: GameState, action: {
            payload: { atoms: Vector[], real: boolean, owner: boolean },
            type: string
        }) => {
            const ownerMapping = action.payload.owner === state.isOwner;
            if (ownerMapping && state.ownerField) {
                let cloned = FieldData.clone(state.ownerField);
                if (action.payload.real)
                    cloned.markReal(action.payload.atoms)
                else
                    cloned.markGuessed(action.payload.atoms)
                state.ownerField = cloned;
            }
            if (!ownerMapping && state.competitorField) {
                let cloned = FieldData.clone(state.competitorField);
                if (action.payload.real)
                    cloned.markReal(action.payload.atoms)
                else
                    cloned.markGuessed(action.payload.atoms)
                state.competitorField = cloned;
            }
        },
    },
})

export const {
    initializeGame, setOwnAtom, setCompetitorAtom, makeMovement,
    unsetOwnAtom, unsetCompetitorAtom, startGame, finishGame,
    setOtherStarted, setOtherFinished, setTrace, removeTrace,
    setTurn, setMarked, setOwner, setGuessedOrReal
} = gameSlice.actions

export const gameReducer = gameSlice.reducer;