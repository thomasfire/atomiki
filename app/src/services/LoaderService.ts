import {Dispatch} from "@reduxjs/toolkit";
import {PageService} from "./PageService";
import {APP_JOIN_ID, APP_USER_ID} from "./API";

export class LoaderService {
    private static instance: LoaderService | null;
    private readonly dispatch: Dispatch<any>;

    private constructor(dispatch: Dispatch<any>) {
        this.dispatch = dispatch;
    }

    public static getInstance(): LoaderService|null {
        return LoaderService.instance;
    }
    public static init(dispatch: Dispatch<any>) {
        if (!LoaderService.instance) LoaderService.instance = new LoaderService(dispatch);
    }

    public parseUrlParams() {
        const url = window.location.search;
        const searchParams = new URLSearchParams(url);
        const joinID = searchParams.get(APP_JOIN_ID);
        const userID = searchParams.get(APP_USER_ID);
        if (userID && joinID) {
            PageService.getInstance()?.loginGame(userID, joinID)
        } else if (joinID) {
            PageService.getInstance()?.joinGame(joinID);
        }
    }
}