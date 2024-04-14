import {Dispatch} from "@reduxjs/toolkit";
import {emitNotification, removeNotification} from "../store/notificationSlice";
import {ENotificationLevel} from "../types/game/ENotificationLevel";

export class NotificationService {
    private static instance: NotificationService | null;

    private readonly dispatch: Dispatch<any>;
    private timer: null | ReturnType<typeof setTimeout>;

    private constructor(dispatch: Dispatch<any>) {
        this.dispatch = dispatch;
        this.timer = null
    }

    public static init(dispatch: Dispatch<any>) {
        if (!NotificationService.instance) NotificationService.instance = new NotificationService(dispatch);
    }


    public static getInstance(): NotificationService | null {
        return NotificationService.instance;
    }

    public emitNotification(message: string, level: ENotificationLevel) {
        if (this.timer) clearTimeout(this.timer)
        setTimeout(() => {
            this.dispatch(emitNotification({message, level}))
        }, 100)

        this.timer = setTimeout(() => {
            this.removeNotification();
        }, 5000)
    }

    public removeNotification() {
        if (this.timer) clearTimeout(this.timer)
        this.dispatch(removeNotification(null))
    }

}