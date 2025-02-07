import {useSelector} from "react-redux";
import {GameStorage} from "../types/game/GameStorage";

export function ResultsStats() {
    const results = useSelector((state: GameStorage) => state.results.gameResults);
    const isOwner = useSelector((state: GameStorage) => state.game.isOwner);
    return results ?
        <div className="py-2 px-2 rounded-sm h-min self-center m-2 grid bg-white">
            <div className="py-2 px-2 rounded-sm bg-blue-100 row-start-1 w-full m-1">
                Your score: {isOwner ? results.ownerScore : results.competitorScore}
            </div>
            <div className="py-2 px-2 rounded-sm bg-rose-100 row-start-2 w-full m-1">
                Competitor score: {isOwner ? results.competitorScore : results.ownerScore}
            </div>
        </div> : (
            <></>
        );
}