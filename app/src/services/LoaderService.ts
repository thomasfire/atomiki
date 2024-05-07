import {PageService} from "./PageService";
import {APP_JOIN_ID, APP_TUTORIAL, APP_USER_ID} from "./API";

export class LoaderService {
    private static instance: LoaderService | null;

    private constructor() {
    }

    private static popStateHandler(_evt: PopStateEvent) {
        LoaderService.getInstance()?.parseUrlParams()
    }

    private subscribeToHistory() {
        addEventListener("popstate", LoaderService.popStateHandler)
    }

    public static getInstance(): LoaderService | null {
        return LoaderService.instance;
    }

    public static init() {
        if (!LoaderService.instance) LoaderService.instance = new LoaderService();
        LoaderService.instance.subscribeToHistory();
    }

    public parseUrlParams() {
        const url = window.location.search;
        const searchParams = new URLSearchParams(url);
        const joinID = searchParams.get(APP_JOIN_ID);
        const userID = searchParams.get(APP_USER_ID);
        const tutorial = searchParams.get(APP_TUTORIAL);

        if (userID && joinID) {
            PageService.getInstance()?.loginGame(userID, joinID)
        } else if (joinID) {
            PageService.getInstance()?.joinGame(joinID);
        } else if (tutorial) {
            PageService.getInstance()?.openTutorial();
        } else {
            PageService.getInstance()?.openIndex(false);
        }
    }
}