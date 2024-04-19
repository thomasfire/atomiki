import React, {useEffect, useRef} from 'react';
import {IndexPage} from "./pages/IndexPage";
import {EPage} from "./types/game/page/EPage";
import {useDispatch, useSelector} from "react-redux";
import {GameStorage} from "./types/game/GameStorage";
import {JoinPage} from "./pages/JoinPage";
import {SettingsPage} from "./pages/SettingsPage";
import {ResultPage} from "./pages/ResultPage";
import {WaitCompetitorPage} from "./pages/WaitCompetitorPage";
import {GamePage} from "./pages/GamePage";
import {TutorialPage} from "./pages/TutorialPage";
import {NotificationService} from "./services/NotificationService";
import {PageService} from "./services/PageService";
import {LoaderService} from "./services/LoaderService";
import {Dispatch} from "@reduxjs/toolkit";

function App() {
    const page: EPage = useSelector(((state: GameStorage) => state.page.currentPage));
    const dispatch: Dispatch<any> = useDispatch();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            NotificationService.init(dispatch);
            PageService.init(dispatch);
            LoaderService.init(dispatch);
            LoaderService.getInstance()?.parseUrlParams();
        }
    }, []);

    switch (page) {
        case EPage.IndexPage:
            return <IndexPage/>
        case EPage.JoinPage:
            return <JoinPage/>
        case EPage.SettingsPage:
            return <SettingsPage/>
        case EPage.ResultPage:
            return <ResultPage/>
        case EPage.WaitCompetitorPage:
            return <WaitCompetitorPage/>
        case EPage.GamePage:
            return <GamePage/>
        case EPage.TutorialPage:
            return <TutorialPage/>
    }
}

export default App;
