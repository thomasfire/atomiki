import {PageService} from "../services/PageService";
import React from "react";

export function ReturnButton({index}: {index: number}) {
    return (
        <button onClick={() => {
            PageService.getInstance()?.openIndex(true)
        }}
                className={`bg-gray-100 hover:bg-gray-300 text-gray-800 col-start-1 row-start-${index}
                    font-bold py-2 px-4 rounded h-min self-center m-1`}>
            Return
        </button>
    );
}