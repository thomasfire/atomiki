import {useSelector} from "react-redux";
import {GameStorage} from "../../types/game/GameStorage";

export function LastMove() {
    const lastMoved = useSelector((state: GameStorage) => state.log.lastMoved);
    const arrivedTo = useSelector((state: GameStorage) => state.log.arrivedTo);
    const field = useSelector((state: GameStorage) => state.game.competitorField);
    return (
        <div>
            <span>
            {
                lastMoved && field && field.cells[lastMoved.x + 1][lastMoved.y + 1].circleNo
            }
            </span>
            <span> - </span>
            <span>
            {
                arrivedTo && field && field.cells[arrivedTo.x + 1][arrivedTo.y + 1].circleNo
            }
            </span>
        </div>
    );
}