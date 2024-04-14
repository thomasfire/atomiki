import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {updateJoinId} from "../store/joinSlice";
import React from "react";
import {GameStorage} from "../types/game/GameStorage";
import {Notification} from "../components/Notification";
import {PageService} from "../services/PageService";
import {ReturnButton} from "../components/ReturnButton";

export function JoinPage() {
    const dispatch: Dispatch<any> = useDispatch();
    const joinID = useSelector((state: GameStorage) => state.join.joinID);
    return (
        <div className="w-full h-full flex content-center justify-center align-middle">
            <div className="grid h-min self-center">
                <input type="text" placeholder="Enter your game ID"
                       value={joinID}
                       className="py-2 px-4 rounded h-min self-center m-1 col-start-1 row-start-1 border-gray-200
                       border-solid border-2 focus-visible:border-gray-400 focus:border-gray-300 focus-visible:outline-none"
                       onChange={event => dispatch(updateJoinId(event.target.value))}/>
                <button onClick={() => {
                    PageService.getInstance()?.joinGame(joinID)
                }}
                        className="bg-blue-500 hover:bg-blue-700 text-white col-start-1 row-start-2
                        font-bold py-2 px-4 rounded h-min self-center m-1">
                    Join game
                </button>
                <ReturnButton index={3}/>
            </div>
            <Notification/>
        </div>
    );
}