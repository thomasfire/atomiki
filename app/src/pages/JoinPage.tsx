import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {updateJoinId} from "../store/joinSlice";
import {openPage} from "../store/pageSlice";
import {EPage} from "../types/game/page/EPage";
import React from "react";

export function JoinPage() {
    const dispatch: Dispatch<any> = useDispatch();
    return (
        <div className="w-full h-full flex content-center justify-center align-middle">
            <div className="grid h-min self-center">
                <input type="text" placeholder="Enter your game ID"
                       className="py-2 px-4 rounded h-min self-center m-1 col-start-1 row-start-1 border-gray-200
                       border-solid border-2 focus-visible:border-gray-400 focus:border-gray-300 focus-visible:outline-none"
                       onChange={event => dispatch(updateJoinId(event.target.value))}/>
                <button onClick={() => dispatch(openPage(EPage.GamePage))}
                        className="bg-blue-500 hover:bg-blue-700 text-white col-start-1 row-start-2
                        font-bold py-2 px-4 rounded h-min self-center m-1">
                    Join game
                </button>
            </div>
        </div>
    );
}