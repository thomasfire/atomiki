import {Dispatch} from "@reduxjs/toolkit";
import {openPage} from "../store/pageSlice";
import {EPage} from "../types/game/page/EPage";
import {CreateGame, JoinGame} from "./CreateGame";
import {GameSettingsDTO} from "../types/transport/GameSettingsDTO";
import {updateCredentials} from "../store/credentialSlice";
import {updateCurrentSettings} from "../store/settingsSlice";
import {WSService} from "./WSService";
import {setWSService} from "../store/serviceSlice";
import {initializeGame, setTurn} from "../store/gameSlice";
import {NotificationService} from "./NotificationService";
import {ENotificationLevel} from "../types/game/ENotificationLevel";
import {CredentialDTO} from "../types/transport/CredentialDTO";
import {setSettings} from "./SettingsReceiver";
import {NOTIFICATION_TYPES} from "../types/transport/CompetitorNotificationDTO";
import {GameSettings} from "../types/transport/GameSettings";

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

    public openIndex() {
        this.dispatch(openPage(EPage.IndexPage))
    }
    public openTutorial() {
        this.dispatch(openPage(EPage.TutorialPage))
    }

    public openJoin() {
        this.dispatch(openPage(EPage.JoinPage))
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
                const ws_svc = new WSService(gameSettingsDTO.credentials.userId);
                this.dispatch(setWSService(ws_svc));
                this.dispatch(initializeGame(gameSettingsDTO.settings));
                ws_svc.Subscribe(this.dispatch)

                this.dispatch(openPage(EPage.GamePage))
            })
            .catch(reason => {
                NotificationService.getInstance()?.emitNotification("Error on joining the game", ENotificationLevel.ERROR)
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
                const ws_svc = new WSService(credentials.userId);
                ws_svc.subscribeToNotification("wait for competitor to join", NOTIFICATION_TYPES.COMPETITOR_JOINED, (_message, _payload) => {
                    this.dispatch(openPage(EPage.GamePage));
                    NotificationService.getInstance()?.emitNotification("Competitor joined the game", ENotificationLevel.INFO)
                });
                ws_svc.Subscribe(this.dispatch)
                this.dispatch(setWSService(ws_svc));
                this.dispatch(setTurn(true));
                this.dispatch(openPage(EPage.WaitCompetitorPage))
            })
            .catch(reason => {
                NotificationService.getInstance()?.emitNotification("Error on creating the game", ENotificationLevel.ERROR)
                console.error(reason)
            });
    }
}