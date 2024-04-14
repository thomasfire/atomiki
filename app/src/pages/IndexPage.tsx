import React, {useEffect} from "react";
import {useDispatch} from 'react-redux';
import {Dispatch} from "@reduxjs/toolkit";
import {setOwner} from "../store/gameSlice";
import {NotificationService} from "../services/NotificationService";
import {Notification} from "../components/Notification";
import {PageService} from "../services/PageService";

export function IndexPage() {
    const dispatch: Dispatch<any> = useDispatch();
    useEffect(() => {
        NotificationService.init(dispatch);
        PageService.init(dispatch)
    }, []);
    return (
        <div className="w-full h-full flex content-center justify-center align-middle">
            <div className="grid h-min self-center">
                <button onClick={() => {
                    PageService.getInstance()?.openSettings()
                    dispatch(setOwner(true))
                }}
                        className="bg-blue-500 hover:bg-blue-700 text-white col-start-1 row-start-1
                        font-bold py-2 px-4 rounded h-min self-center m-1">
                    New game
                </button>
                <button onClick={() => {
                    PageService.getInstance()?.openJoin()
                    dispatch(setOwner(false))
                }}
                        className="bg-red-500 hover:bg-red-700 text-white col-start-1 row-start-2
                        font-bold py-2 px-4 rounded h-min self-center m-1">
                    Join existing game
                </button>
            </div>
            <Notification/>
        </div>
    );
}