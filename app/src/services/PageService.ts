import {Dispatch} from "@reduxjs/toolkit";
import {openPage} from "../store/pageSlice";
import {EPage} from "../types/game/page/EPage";
import {CreateGame, JoinGame, LoginGame} from "./CreateGame";
import {GameSettingsDTO} from "../types/transport/GameSettingsDTO";
import {updateCredentials} from "../store/credentialSlice";
import {updateCurrentSettings} from "../store/settingsSlice";
import {WSService} from "./WSService";
import {
    initializeGame, restoreGame,
    setTurn,
} from "../store/gameSlice";
import {NotificationService} from "./NotificationService";
import {ENotificationLevel} from "../types/game/ENotificationLevel";
import {CredentialDTO} from "../types/transport/CredentialDTO";
import {setSettings} from "./SettingsReceiver";
import {NOTIFICATION_TYPES} from "../types/transport/CompetitorNotificationDTO";
import {GameSettings} from "../types/transport/GameSettings";
import {APP_JOIN_ID, APP_TUTORIAL, APP_USER_ID} from "./API";
import {OwnGameStateDTO} from "../types/transport/OwnGameStateDTO";
import {addToLog} from "../store/logSlice";
import {Status} from "../types/transport/Status";
import Dict = NodeJS.Dict;

function setUrlParameters(dict: Dict<string>) {
    let newUrl = new URL(window.location.href);
    Object.entries(dict).forEach(([key, value]) => {
        (key && value) ? newUrl.searchParams.set(key, value) : null;
    })
    if (isSecureContext)
        window.history.pushState({}, "", newUrl.search);
    else
        console.error("Context is not secure, cannot set URL")
}

function clearUrlParameters() {
    let newUrl = new URL(window.location.href);
    newUrl.searchParams.delete(APP_JOIN_ID);
    newUrl.searchParams.delete(APP_USER_ID);
    newUrl.searchParams.delete(APP_TUTORIAL);
    if (isSecureContext)
        window.history.pushState({}, "", "/" + newUrl.search);
    else
        console.error("Context is not secure, cannot set URL")
}


export class PageService {
    private static instance: PageService | null;

    private readonly dispatch: Dispatch<any>;

    private constructor(dispatch: Dispatch<any>) {
        this.dispatch = dispatch;
    }

    public static init(dispatch: Dispatch<any>) {
        if (!PageService.instance) PageService.instance = new PageService(dispatch);
    }


    public static getInstance(): PageService | null {
        return PageService.instance;
    }

    public openIndex(clearUrl: boolean) {
        this.dispatch(openPage(EPage.IndexPage))
        if (clearUrl) clearUrlParameters()
    }

    public openTutorial() {
        this.dispatch(openPage(EPage.TutorialPage))
        setUrlParameters({[APP_TUTORIAL]: "true"})
    }

    public openSettings() {
        this.dispatch(openPage(EPage.SettingsPage))
    }

    public openResults() {
        this.dispatch(openPage(EPage.ResultPage))
    }

    public joinGame(joinID: string) {
        JoinGame(joinID)
            .then((gameSettingsDTO: GameSettingsDTO) => {
                this.dispatch(updateCredentials(gameSettingsDTO.credentials))
                this.dispatch(updateCurrentSettings(gameSettingsDTO.settings))
                setUrlParameters({
                    [APP_USER_ID]: gameSettingsDTO.credentials.userId,
                    [APP_JOIN_ID]: gameSettingsDTO.credentials.gameId
                })
                WSService.init(gameSettingsDTO.credentials.userId)
                const ws_svc = WSService.getInstance();
                this.dispatch(initializeGame(gameSettingsDTO.settings));
                ws_svc?.Subscribe(this.dispatch)

                this.dispatch(openPage(EPage.GamePage))
            })
            .catch(reason => {
                NotificationService.getInstance()?.emitNotification("Error on joining the game", ENotificationLevel.ERROR)
                clearUrlParameters()
                console.error(reason)
            });
    }

    public loginGame(userID: string, joinID: string) {
        LoginGame(userID, joinID)
            .then((ownGameStateDTO: OwnGameStateDTO) => {
                if (ownGameStateDTO.competitorStatus === Status.FINISHED && ownGameStateDTO.ownerGame.status === Status.FINISHED) {
                    NotificationService.getInstance()?.emitNotification("Game already closed", ENotificationLevel.WARNING)
                    clearUrlParameters()
                    return
                } else {
                    this.dispatch(openPage(EPage.GamePage));
                }

                this.dispatch(updateCredentials(ownGameStateDTO.credential))
                this.dispatch(updateCurrentSettings(ownGameStateDTO.gameSettings))

                this.dispatch(restoreGame(ownGameStateDTO))

                ownGameStateDTO.ownerGame.movesLog.logEntries.forEach((value, _index) => {
                    this.dispatch(addToLog(value));
                })

                WSService.init(ownGameStateDTO.credential.userId)
                const ws_svc = WSService.getInstance();
                ws_svc?.Subscribe(this.dispatch)
            })
            .catch(reason => {
                NotificationService.getInstance()?.emitNotification("Error restoring the game", ENotificationLevel.ERROR)
                clearUrlParameters()
                console.error(reason)
            });
    }

    public createGame(currentSettings: GameSettings | null) {
        CreateGame()
            .then((credentials: CredentialDTO) => {
                this.dispatch(updateCredentials(credentials))
                currentSettings && setSettings(currentSettings, credentials).then((settings: GameSettingsDTO) => {
                    this.dispatch(updateCredentials(settings.credentials))
                    this.dispatch(updateCurrentSettings(settings.settings))
                    this.dispatch(initializeGame(settings.settings));
                }).catch(reason => {
                    NotificationService.getInstance()?.emitNotification("Error on applying settings", ENotificationLevel.ERROR)
                    console.error(reason)
                });
                WSService.init(credentials.userId)
                const ws_svc = WSService.getInstance();
                ws_svc?.subscribeToNotification("wait for competitor to join", NOTIFICATION_TYPES.COMPETITOR_JOINED, (_message, _payload) => {
                    this.dispatch(openPage(EPage.GamePage));
                    setUrlParameters({[APP_USER_ID]: credentials.userId, [APP_JOIN_ID]: credentials.gameId})
                    NotificationService.getInstance()?.emitNotification("Competitor joined the game", ENotificationLevel.INFO)
                });
                ws_svc?.Subscribe(this.dispatch)
                this.dispatch(setTurn(true));
                this.dispatch(openPage(EPage.WaitCompetitorPage))
            })
            .catch(reason => {
                NotificationService.getInstance()?.emitNotification("Error on creating the game", ENotificationLevel.ERROR)
                clearUrlParameters()
                console.error(reason)
            });
    }
}