import {useSelector} from "react-redux";
import React from "react";
import {GameStorage} from "../types/game/GameStorage";
import {CopyButton} from "../components/CopyButton";
import {Notification} from "../components/Notification";
import {ReturnButton} from "../components/ReturnButton";
import {APP_JOIN_ID} from "../services/API";

function addUrlParameter(key: string, value: string) {
    let newUrl = new URL(window.location.href);
    newUrl.searchParams.set(key, value);
    return newUrl.toString();
}

export function WaitCompetitorPage() {
    const gameId = useSelector((state: GameStorage) => state.credential.gameID);

    const withUrl = gameId ? addUrlParameter(APP_JOIN_ID, gameId) : null;

    return (
        <div className="w-full h-full flex content-center justify-center align-middle">
            <div className="grid h-min self-center">
                <div className="bg-white col-start-1 row-start-1 text-gray-800
                                        font-bold py-2 px-4 rounded h-min self-start m-3">
                    Share the Game ID to your competitor, so he can join the game
                </div>
                <input type="text" readOnly={true}
                       className={`py-2 px-4 rounded h-min self-center m-1 col-start-1 row-start-2 border-gray-200
                       border-solid border-2 focus-visible:border-gray-300 focus:border-gray-300 focus-visible:outline-none `}
                       value={withUrl || "Loading credentials..."}/>
                <CopyButton value={withUrl || ""} classes={"row-start-2"}/>
                <div className="bg-white col-start-1 row-start-3 text-gray-800
                                        font-bold py-2 px-4 rounded h-min self-start m-3">
                    Game will start as soon as competitor joins...
                </div>
                <ReturnButton index={4}/>
            </div>
            <Notification/>
        </div>
    );
}