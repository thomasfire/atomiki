import React, {useEffect, useRef} from "react";
import {useDispatch} from 'react-redux';
import {Dispatch} from "@reduxjs/toolkit";
import {setOwner} from "../store/gameSlice";
import {NotificationService} from "../services/NotificationService";
import {Notification} from "../components/Notification";
import {PageService} from "../services/PageService";
import {LoaderService} from "../services/LoaderService";

export function IndexPage() {
    const dispatch: Dispatch<any> = useDispatch();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            NotificationService.init(dispatch);
            PageService.init(dispatch);
            LoaderService.init(dispatch);
            LoaderService.getInstance()?.parseUrlParams();
        }
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
                <button onClick={() => {
                    PageService.getInstance()?.openTutorial()
                }}
                        className="bg-emerald-500 hover:bg-emerald-700 text-white col-start-1 row-start-3
                        font-bold py-2 px-4 rounded h-min self-center m-1">
                    Tutorial
                </button>
            </div>
            <Notification/>
        </div>
    );
}