import {CredentialDTO} from "../types/transport/CredentialDTO";
import {CREATE_URL, JOIN_URL} from "./API";
import {GameSettingsDTO} from "../types/transport/GameSettingsDTO";


export async function CreateGame(): Promise<CredentialDTO> {
    return fetch(CREATE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(async (value: Response) => {
        const json = await value.json();
        if (!value.ok) {
            console.error(json)
            throw Error(json)
        }
        return json;
    })
}

export async function JoinGame(gameId: string): Promise<GameSettingsDTO> {
    return fetch(JOIN_URL+gameId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(async (value: Response) => {
        const json = await value.json();
        if (!value.ok) {
            console.error(json)
            throw Error(json)
        }
        return json;
    })

}