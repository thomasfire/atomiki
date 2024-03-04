let SockJS = require("sockjs-client");
let Stomp = require("stompjs");
const assert = require("assert");

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

async function delayedExecution(callback, ms_wait) {
    return new Promise((resolve, _reject) => setTimeout(() => {
        callback();
        resolve("done")
    }, ms_wait));
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

    assert.notEqual(gameSettings.credentials, undefined);
    assert.notEqual(gameSettings.settings, undefined);
    assert.equal(gameSettings.credentials.userId, ownerId);
    assert.equal(gameSettings.credentials.gameId, gameId);
    assert.equal(gameSettings.settings.atomsMaxCount, 4);
    assert.equal(gameSettings.settings.fieldSize, 8);

    const competitorGameSettings = await makeRequest("/join/" + gameId, "GET", null);

    const competitorId = competitorGameSettings.credentials.userId;
    assert.notEqual(competitorId, ownerId);
    assert.equal(competitorGameSettings.credentials.gameId, gameId);

    let ownerNotifications = [];
    let competitorNotifications = [];
    let ownerGame = [];
    let competitorGame = [];

    let socket = new SockJS('http://localhost:8080/ws-guide');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, async (frame) => {
        console.log(frame);
        stompClient.subscribe('/game/' + ownerId, (message) => {
            console.log("owner: ", message)
            message.ack()
            ownerGame.push(JSON.parse(message.body))
        });
        stompClient.subscribe('/notifications/' + ownerId, (message) => {
            console.log("owner: ", message)
            message.ack()
            ownerNotifications.push(JSON.parse(message.body))
        });
        stompClient.subscribe('/notifications/' + competitorId, (message) => {
            console.log("competitor: ", message)
            message.ack()
            competitorNotifications.push(JSON.parse(message.body))
        });
        stompClient.subscribe('/game/' + competitorId, (message) => {
            console.log("competitor: ", message)
            message.ack()
            competitorGame.push(JSON.parse(message.body))
        });

        const OWNER_COORDS_LIST = {
            "coordsList": [
                {"x": 2, "y": 2},
                {"x": 5, "y": 2},
                {"x": 2, "y": 5},
                {"x": 5, "y": 5}]
        };
        const COMPETITOR_COORDS_LIST = {
            "coordsList": [
                {"x": 3, "y": 1},
                {"x": 3, "y": 4},
                {"x": 1, "y": 6},
                {"x": 6, "y": 6}]
        };

        stompClient.send("/ws/set-own-atoms/" + ownerId, {}, JSON.stringify(OWNER_COORDS_LIST));

        await delayedExecution(() => {
            assert.strictEqual(competitorNotifications.at(-1).type, "COMPETITOR_SET")
            assert.deepEqual(ownerGame.at(-1), OWNER_COORDS_LIST)
        }, 100);
        console.info("SET OWNER ATOMS OK");

        stompClient.send("/ws/set-own-atoms/" + competitorId, {}, JSON.stringify(COMPETITOR_COORDS_LIST));
        await delayedExecution(() => {
            assert.strictEqual(ownerNotifications.at(-1).type, "COMPETITOR_SET")
            assert.deepEqual(competitorGame.at(-1), COMPETITOR_COORDS_LIST)
        }, 100);
        console.info("SET COMPETITOR ATOMS OK");

        stompClient.send("/ws/make-move/"+ownerId, {}, JSON.stringify({
            coords: {
                x: 4,
                y: -1
            }
        }));
        await delayedExecution(() => {
            assert.deepEqual(ownerGame.at(-1).startPoint, {x: 4, y: -1});
            assert.deepEqual(ownerGame.at(-1).endPoint, {x: 8, y: 1});
            assert.strictEqual(competitorNotifications.at(-1).type, "COMPETITOR_MOVED")
            assert.deepEqual(competitorNotifications.at(-1).payload.trace.at(0), {x: 4, y: -1});
            assert.deepEqual(competitorNotifications.at(-1).payload.trace.at(-1), {x: 8, y: 1});
            assert.deepEqual(competitorNotifications.at(-1).payload, {"trace":[{"x":4,"y":-1},{"x":4,"y":0},{"x":4,"y":1},{"x":5,"y":1},{"x":6,"y":1},{"x":7,"y":1},{"x":8,"y":1}]});
        }, 100);
        console.info("OWNER MADE MOVE OK");

        stompClient.send("/ws/make-move/"+competitorId, {}, JSON.stringify({
            coords: {
                x: 4,
                y: 8
            }
        }));
        await delayedExecution(() => {
            assert.deepEqual(competitorGame.at(-1).startPoint, {x: 4, y: 8});
            assert.deepEqual(competitorGame.at(-1).endPoint, null);
            assert.strictEqual(ownerNotifications.at(-1).type, "COMPETITOR_MOVED")
            assert.deepEqual(ownerNotifications.at(-1).payload.trace.at(0), {x: 4, y: 8});
            assert.deepEqual(ownerNotifications.at(-1).payload.trace.at(-1), {x: 3, y: 5});
            assert.deepEqual(ownerNotifications.at(-1).payload, {"trace":[{"x":4,"y":8},{"x":4,"y":7},{"x":4,"y":6},{"x":4,"y":5},{"x":3,"y":5}]});
        }, 100);
        console.info("COMPETITOR MADE MOVE OK");


       /* stompClient.disconnect(function () {
            console.log('Disconnected');
        });*/
    });

}

main().then(async r => await r);