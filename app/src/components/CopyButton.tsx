import React, {useState} from "react";
import iconCopy from "../../assets/icon-copy.svg";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {emitNotification} from "../store/notificationSlice";
import {ENotificationLevel} from "../types/game/ENotificationLevel";

enum CopyState {
    UNKNOWN = "bg-white hover:bg-gray-100",
    ERROR = "bg-rose-300 hover:bg-rose-100",
    OK = "bg-emerald-300 hover:bg-emerald-100"
}

export function CopyButton({value, classes}: { value: string, classes: string }) {
    const [success, setSuccess] = useState(CopyState.UNKNOWN);
    const dispatch: Dispatch<any> = useDispatch();

    const copyToClipboard = (text: string) => {
        try {
            navigator.clipboard.writeText(text)
                .then((_value) => { // success
                    setSuccess(CopyState.OK);
                    setTimeout(() => {setSuccess(CopyState.UNKNOWN)}, 1500);
                }, (reason) => { // error
                    setSuccess(CopyState.ERROR);
                    setTimeout(() => {setSuccess(CopyState.UNKNOWN)}, 3000);
                    console.warn("Copy to clipboard rejected: ", reason)
                    dispatch(emitNotification({message: "Copy to clipboard failed. Ensure you are using HTTPS.", level: ENotificationLevel.ERROR, dispatch: dispatch}))
                });
        } catch (e) {
            setSuccess(CopyState.ERROR);
            setTimeout(() => {setSuccess(CopyState.UNKNOWN)}, 3000);
            console.warn("Copy to clipboard error: ", e)
            dispatch(emitNotification({message: "Copy to clipboard failed. Ensure you are using HTTPS.", level: ENotificationLevel.ERROR, dispatch: dispatch}))
        }
    };

    return (
        <button className={`py-2 px-2 rounded h-min self-center m-1
                                    col-start-2 row-start-1 ${success} ${classes}`}
                onClick={() => copyToClipboard(value)}>
            <img src={iconCopy} alt="copy to clipboard" className="self-center"/>
        </button>
    );
}