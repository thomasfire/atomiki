import {useSelector} from "react-redux";
import {GameStorage} from "../types/game/GameStorage";
import {WINNER, WinnerFromGameResults} from "../types/transport/GameResults";

export function Winner() {
    const isOwner = useSelector((state: GameStorage) => state.game.isOwner);
    const results = useSelector((state: GameStorage) => state.results.gameResults);
    const winner = results && WinnerFromGameResults(results);

    let signage: string | null = null;
    let background = "";
    if (winner !== null) {
        if ((isOwner && WINNER.OWNER == winner) || (!isOwner && winner == WINNER.COMPETITOR)) {
            signage = "YOU"
            background = "bg-emerald-600"
        } else {
            if ((!isOwner && WINNER.OWNER == winner) || (isOwner && winner == WINNER.COMPETITOR)) {
                signage = "COMPETITOR"
                background = "bg-rose-600"
            } else if (winner == WINNER.DRAW) {
                signage = "DRAW"
                background = "bg-blue-600"
            }
        }
    }

    console.log()

    return signage ? (
        <div className={`${background} py-2 px-2 rounded h-min self-center m-2 text-white`}>
            Winner: <span className="text-white font-bold">{signage}</span>
        </div>
    ) : <></>;
}