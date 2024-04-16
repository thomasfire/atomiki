import {useSelector} from "react-redux";
import {GameStorage} from "../types/game/GameStorage";
import React, {useEffect, useRef} from "react";
import {Field} from "../components/game/Field";
import {Winner} from "../components/Winner";
import {ResultsStats} from "../components/ResultsStats";
import {Notification} from "../components/Notification";
import {WSService} from "../services/WSService";

export function ResultPage() {
    const ownField = useSelector((state: GameStorage) => state.game.ownerField);
    const competitorField = useSelector((state: GameStorage) => state.game.competitorField);

    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            WSService.getInstance()?.shutdown();
        }
    }, []);

    return (
        <div className="w-full flex content-center justify-center align-middle my-4">
            <div className="grid h-min self-center m-2">
                <div className="row-start-1 self-center m-2">
                    <Winner/>
                </div>
                <div className="row-start-2 self-center m-2">
                    {ownField && <Field owner={true} fieldData={ownField} key="owner_field"/>}
                </div>
                <div className="row-start-3 self-center m-2">
                    {competitorField && <Field owner={false} fieldData={competitorField} key="competitor_field"/>}
                </div>
                <div className="row-start-4 self-center w-full flex content-center justify-center align-middle h-32 my-3">
                    <ResultsStats/>
                </div>
            </div>
            <Notification/>
        </div>
    );
}