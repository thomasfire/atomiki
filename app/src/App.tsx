import React from 'react';
import {IndexPage} from "./pages/IndexPage";
import {EPage} from "./types/game/page/EPage";
import {useSelector} from "react-redux";
import {GameStorage} from "./types/game/GameStorage";

function App() {
    const page: EPage = useSelector(((state: GameStorage) => state.page.currentPage));

    switch (page) {
        case EPage.IndexPage:
            return <IndexPage/>
    }
    return <IndexPage/>
}

export default App;
