let SockJS = require("sockjs-client");
let Stomp = require("stompjs");
//const fetch = require('node-fetch');

const baseURL = "http://localhost:8080"

async function makeRequest(endpoint, method, body) {
    return fetch(baseURL + endpoint, {
        method: method,
        body: method === "GET" ? undefined : JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(async res => await res.json())
        .catch(reason => console.error(reason));
}

async function main() {
    const credentials = await makeRequest("/create", "POST", {});

    const gameId = credentials.gameId;
    const ownerId = credentials.userId;

    const gameSettings = await makeRequest("/set", "POST", {
        "credentials": {
            "userId": ownerId,
            "gameId": gameId
        },
        "settings": {
            "atomsMaxCount": 4,
            "fieldSize": 8
        }
    });

    const competitorGameSettings = await makeRequest("/join/" + gameId, "GET", null)

    const competitorId = competitorGameSettings.credentials.userId;


    let socket = new SockJS('http://localhost:8080/ws-guide');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log(frame);
        stompClient.subscribe('/secured/user/' + ownerId, function (ticks) {
            console.log("owner: ", ticks)
        });
        stompClient.subscribe('/secured/user/' + competitorId, function (ticks) {
            console.log("competitor: ", ticks)
        });
        stompClient.send("/ws/set-own-atoms/" + ownerId, {}, JSON.stringify({
            "coordsList": [
                {"x": 2, "y": 2},
                {"x": 5, "y": 2},
                {"x": 2, "y": 5},
                {"x": 5, "y": 5}]
        }));
    });



    //stompClient.disconnect(function () {
    //    console.log('Disconnected');
    // });
}

main().then(async r => await r);