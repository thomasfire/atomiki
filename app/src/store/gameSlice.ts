import {createSlice, Slice} from "@reduxjs/toolkit";
import {GameState} from "../types/game/page/GameState";
import {GameSettings} from "../types/transport/GameSettings";
import {FieldData} from "../types/game/view/FieldData";
import {Vector} from "../types/transport/Vector";
import {Trace} from "../types/transport/Trace";
import {AtomsMarkDTO} from "../types/transport/AtomsMarkDTO";

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
            else
                console.warn("Cannot start game again")
        },
        finishGame: (state: GameState) => {
            if (!state.gameFinished && state.gameStarted)
                state.gameFinished = true;
            else
                console.warn("Cannot finish game again")
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
                } catch (e) {
                    console.warn(e)
                }
            } else {
                // TODO notification
                console.warn("Cannot set own atoms when game is started")
            }
        },
        setCompetitorAtom: (state: GameState, action: { payload: Vector, type: string }) => {
            if (!state.gameFinished && state.gameStarted) {
                try {
                    let copy = state.competitorField ? FieldData.clone(state.competitorField) : null;
                    copy?.setAtom(action.payload)
                    state.competitorField = copy;
                } catch (e) {
                    console.warn(e)
                }
            } else {
                console.warn("Cannot set competitor atoms when game is not started or finished")
            }
        },

        unsetOwnAtom: (state: GameState, action: { payload: Vector, type: string }) => {
            if (!state.gameStarted) {
                let copy = state.ownerField ? FieldData.clone(state.ownerField) : null;
                copy?.unsetAtom(action.payload)
                state.ownerField = copy;
            } else {
                // TODO notification
                console.warn("Cannot unset own atoms when game is started")
            }
        },
        unsetCompetitorAtom: (state: GameState, action: { payload: Vector, type: string }) => {
            if (!state.gameFinished && state.gameStarted) {
                try {
                    let copy = state.competitorField ? FieldData.clone(state.competitorField) : null;
                    copy?.unsetAtom(action.payload)
                    state.competitorField = copy;
                } catch (e) {
                    console.warn(e)
                }
            } else {
                console.warn("Cannot unset competitor atoms when game is not started or finished")
            }
        },

        setTrace: (state: GameState, action: {payload: Trace, type: string}) => {
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
        setTurn: (state: GameState, action: {payload: boolean, type: string}) => {
            state.ownerTurn = action.payload;
        },
        setMarked: (state: GameState, action: {payload: AtomsMarkDTO, type: string}) => {
            if (state.ownerField) {
                let cloned = FieldData.clone(state.ownerField);
                cloned.markAtom(action.payload)
                state.ownerField = cloned;
            }
        },
        setOwner: (state: GameState, action: {payload: boolean, type: string}) => {
            state.isOwner = action.payload;
        },
        setOwnerGuessed: (state: GameState, action: {payload: Vector[], type: string}) => {
            if (state.ownerField) {
                let cloned = FieldData.clone(state.ownerField);
                cloned.markGuessed(action.payload)
                state.ownerField = cloned;
            }
        },
        setGuessedOrReal: (state: GameState, action: {payload: { atoms: Vector[], real: boolean, owner: boolean }, type: string}) => {
            const ownerMapping = action.payload.owner === state.isOwner;
            console.log(ownerMapping, action.payload.owner, action.payload.real, state.isOwner, action.payload.atoms)
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
    initializeGame, setOwnAtom, setCompetitorAtom,
    unsetOwnAtom, unsetCompetitorAtom, startGame, finishGame,
    setOtherStarted, setOtherFinished, setTrace, removeTrace,
    setTurn, setMarked, setOwner, setGuessedOrReal
} = gameSlice.actions

export const gameReducer = gameSlice.reducer;