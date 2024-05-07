export const AVAILABLE_SETTINGS_URL = "/getAvailableSettings"
export const CREATE_URL = "/create"
export const JOIN_URL = "/join/"
export const LOGIN_URL = "/login/"
export const SET_URL = "/set"

export const WS_GUIDE_URL = "/ws-guide";
export const NOTIFICATION_TOPIC = "/notifications/";
export const GAME_TOPIC = "/game/";
export const WS_SET_OWN_ATOMS = "/ws/set-own-atoms/";
export const WS_MAKE_MOVE = "/ws/make-move/";
export const WS_MARK_ATOM = "/ws/mark-atom/";
export const WS_FINISH = "/ws/finish/";
export const WS_LOGS = "/ws/logs/";


export const APP_JOIN_ID = "joinid";
export const APP_USER_ID = "userid";
export const APP_TUTORIAL = "tutorial";

export function isHttps() {
    return (document.location.protocol == 'https:');
}