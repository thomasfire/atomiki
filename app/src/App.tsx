import React from 'react';
import {IndexPage} from "./pages/IndexPage";
import {EPage} from "./types/game/page/EPage";
import {useSelector} from "react-redux";
import {GameStorage} from "./types/game/GameStorage";
import {JoinPage} from "./pages/JoinPage";
import {SettingsPage} from "./pages/SettingsPage";
import {ResultPage} from "./pages/ResultPage";
import {WaitCompetitorPage} from "./pages/WaitCompetitorPage";
import {GamePage} from "./pages/GamePage";
import {TestPage} from "./pages/TestPage";

function App() {
    const page: EPage = useSelector(((state: GameStorage) => state.page.currentPage));

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
        case EPage.TestPage:
            return <TestPage/>
    }
}

export default App;
