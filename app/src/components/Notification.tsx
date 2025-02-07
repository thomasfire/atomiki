import React from "react";
import {useSelector} from "react-redux";
import {GameStorage} from "../types/game/GameStorage";
import {ENotificationLevel} from "../types/game/ENotificationLevel";
import {NotificationService} from "../services/NotificationService";
import iconError from "../../assets/icon-error.svg";
import iconWarning from "../../assets/icon-warning.svg";
import iconInfo from "../../assets/icon-info.svg";

export function Notification() {
    const level = useSelector((state: GameStorage) => state.notification.level);
    const message = useSelector((state: GameStorage) => state.notification.message);
    let icon = "";
    let color = "";
    switch (level) {
        case ENotificationLevel.ERROR:
            icon = iconError
            color = "red"
            break
        case ENotificationLevel.INFO:
            icon = iconInfo
            color = "emerald"
            break
        case ENotificationLevel.WARNING:
            icon = iconWarning
            color = "amber"
            break
    }

    return (
        <div className={`${message ? "opacity-100" : "opacity-0 -translate-y-full"} absolute transition-all duration-300 top-0
                m-2 left-1/2 transform -translate-x-1/2
                inset-x-0 p-2 bg-${color}-200 rounded
                border-none text-gray-800 w-64 min-h-12 max-h-24 h-min`}
             onClick={() => NotificationService.getInstance()?.removeNotification()}>
            <div className="flex">
                <div className="shrink-0 justify-self-center self-center align-middle">
                    <img src={icon} className={`h-12 w-12`} aria-hidden="true" alt={`icon-${level?.toString}`} aria-placeholder="icon"/>
                </div>
                <div className="ml-3 justify-self-center self-center align-middle">
                    <p className="text-sm font-medium">{message}</p>
                </div>
            </div>
        </div>
    );
}