import {useSelector} from "react-redux";
import {GameStorage} from "../../types/game/GameStorage";
import {LogEntry} from "../../types/transport/LogEntry";

export function Logs() {
    const logs = useSelector((state: GameStorage) => state.log.log);
    const field = useSelector((state: GameStorage) => state.game.competitorField);
    return (
        <textarea readOnly={true} className="h-full w-full
                        border-gray-200
                       border-solid border-2 focus-visible:border-gray-300
                       focus:border-gray-300 focus-visible:outline-hidden" value={field ? logs.logEntries.map(((item: LogEntry) => {
            return `${field.cells[item.startPoint.x][item.startPoint.y].circleNo?.toString()} - ${item.endPoint && field.cells[item.endPoint.x][item.endPoint.y].circleNo?.toString()}`
        })).join("\n") : ""}/>
    );
}