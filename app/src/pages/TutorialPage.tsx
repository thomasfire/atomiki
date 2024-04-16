import React from "react";
import {PageService} from "../services/PageService";
import Markdown from "marked-react";
import * as tutorial from "../../assets/Tutorial.md";
import '../markdown.css';


export function TutorialPage() {
    const markStyles = `[h1]:text`;
    return (
        <div className="w-full flex content-center justify-center align-middle">
            <div className="grid h-min self-center">
                <div className={`bg-white text-gray-800 col-start-1 row-start-1 min-w-72 markdown w-3/4
                    inline-block py-2 px-4 h-min self-center m-1 ${markStyles} justify-self-center`}>
                    <Markdown value={tutorial.default}/>
                </div>
                <button onClick={() => {
                    PageService.getInstance()?.openIndex()
                }}
                        className={`bg-gray-100 hover:bg-gray-300 text-gray-800 col-start-1 row-start-2
                    font-bold py-2 px-4 rounded h-min self-center m-1`}>
                    Return
                </button>
            </div>
        </div>
    );
}