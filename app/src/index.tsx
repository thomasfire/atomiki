import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './tailwind.css';
import store from "./store/store";
import {Provider} from "react-redux";
import {Copyright} from "./components/Copyright";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
            <Copyright/>
        </Provider>
    </React.StrictMode>
);

