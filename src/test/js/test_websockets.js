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

    let stompClient = Stomp.overWS('ws://localhost:8080/ws-guide');
    stompClient.connect({}, async (frame) => {
            console.log(frame);
            stompClient.subscribe('/game/' + ownerId, (message) => {
                console.log("owner game: ", message)
                message.ack()
                ownerGame.push(JSON.parse(message.body))
            });
            stompClient.subscribe('/notifications/' + ownerId, (message) => {
                console.log("owner notification: ", message)
                message.ack()
                ownerNotifications.push(JSON.parse(message.body))
            });
            stompClient.subscribe('/notifications/' + competitorId, (message) => {
                console.log("competitor notification: ", message)
                message.ack()
                competitorNotifications.push(JSON.parse(message.body))
            });
            stompClient.subscribe('/game/' + competitorId, (message) => {
                console.log("competitor game: ", message)
                message.ack()
                competitorGame.push(JSON.parse(message.body))
            });

            const coordsSortFn = (a, b) => {
                return a.x - b.x ? a.x - b.x : a.y - b.y;
            }

            const OWNER_COORDS_LIST = {
                "coordsList": [
                    {"x": 3, "y": 3},
                    {"x": 6, "y": 3},
                    {"x": 3, "y": 6},
                    {"x": 6, "y": 6}].toSorted(coordsSortFn)
            };
            const COMPETITOR_COORDS_LIST = {
                "coordsList": [
                    {"x": 4, "y": 2},
                    {"x": 4, "y": 5},
                    {"x": 2, "y": 7},
                    {"x": 7, "y": 7}].toSorted(coordsSortFn)
            };

            stompClient.send("/ws/set-own-atoms/" + ownerId, {}, JSON.stringify(OWNER_COORDS_LIST));

            await delayedExecution(() => {
                assert.strictEqual(competitorNotifications.at(-1).type, "COMPETITOR_SET")
                assert.deepEqual(ownerGame.at(-1).payload, OWNER_COORDS_LIST)
            }, 10);
            console.info("SET OWNER ATOMS OK");

            stompClient.send("/ws/set-own-atoms/" + competitorId, {}, JSON.stringify(COMPETITOR_COORDS_LIST));
            await delayedExecution(() => {
                assert.strictEqual(ownerNotifications.at(-1).type, "COMPETITOR_SET")
                assert.deepEqual(competitorGame.at(-1).payload, COMPETITOR_COORDS_LIST)
            }, 10);
            console.info("SET COMPETITOR ATOMS OK");

            stompClient.send("/ws/make-move/" + ownerId, {}, JSON.stringify({
                coords: {
                    x: 5,
                    y: 0
                }
            }));
            await delayedExecution(() => {
                assert.deepEqual(ownerGame.at(-1).payload.startPoint, {x: 5, y: 0});
                assert.deepEqual(ownerGame.at(-1).payload.endPoint, {x: 9, y: 2});
                assert.strictEqual(competitorNotifications.at(-1).type, "COMPETITOR_MOVED")
                assert.deepEqual(competitorNotifications.at(-1).payload.trace.at(0), {x: 5, y: 0});
                assert.deepEqual(competitorNotifications.at(-1).payload.trace.at(-1), {x: 9, y: 2});
                assert.deepEqual(competitorNotifications.at(-1).payload, {
                    "trace": [{"x": 5, "y": 0}, {
                        "x": 5,
                        "y": 1
                    }, {"x": 5, "y": 2}, {"x": 6, "y": 2}, {"x": 7, "y": 2}, {"x": 8, "y": 2}, {"x": 9, "y": 2}]
                });
            }, 10);
            console.info("OWNER MADE MOVE OK");

            stompClient.send("/ws/make-move/" + competitorId, {}, JSON.stringify({
                coords: {
                    x: 5,
                    y: 9
                }
            }));
            await delayedExecution(() => {
                assert.deepEqual(competitorGame.at(-1).payload.startPoint, {x: 5, y: 9});
                assert.deepEqual(competitorGame.at(-1).payload.endPoint, null);
                assert.strictEqual(ownerNotifications.at(-1).type, "COMPETITOR_MOVED")
                assert.deepEqual(ownerNotifications.at(-1).payload.trace.at(0), {x: 5, y: 9});
                assert.deepEqual(ownerNotifications.at(-1).payload.trace.at(-1), {x: 4, y: 6});
                assert.deepEqual(ownerNotifications.at(-1).payload, {
                    "trace": [{"x": 5, "y": 9}, {"x": 5, "y": 8}, {
                        "x": 5,
                        "y": 7
                    }, {"x": 5, "y": 6}, {"x": 4, "y": 6}]
                });
            }, 10);
            console.info("COMPETITOR MADE MOVE OK");

            const OWNER_GUESS = { // this dude is right
                coords: {
                    x: 4,
                    y: 2
                },
                mark: true
            };
            const COMPETITOR_GUESS = { // this dude is wrong
                coords: {
                    x: 5,
                    y: 6
                },
                mark: true
            };

            await delayedExecution(() => stompClient.send("/ws/mark-atom/" + ownerId, {}, JSON.stringify(OWNER_GUESS)), 10);
            await delayedExecution(() => stompClient.send("/ws/mark-atom/" + competitorId, {}, JSON.stringify(COMPETITOR_GUESS)), 10);

            await delayedExecution(() => {
                assert.deepEqual(ownerGame.at(-1).payload, OWNER_GUESS);
                assert.deepEqual(competitorGame.at(-1).payload, COMPETITOR_GUESS);
                assert.strictEqual(ownerNotifications.at(-1).type, "COMPETITOR_MARKED")
                assert.strictEqual(competitorNotifications.at(-1).type, "COMPETITOR_MARKED")
                // basically they just exchanged each other's guess info
                assert.deepEqual(ownerNotifications.at(-1).payload, COMPETITOR_GUESS);
                assert.deepEqual(competitorNotifications.at(-1).payload, OWNER_GUESS);
            }, 10);
            console.info("OWNER AND COMPETITOR MARKED EACH OTHERS ATOMS");

            stompClient.send("/ws/finish/" + ownerId, {}, "");
            await delayedExecution(() => stompClient.send("/ws/finish/" + competitorId, {}, ""), 10); // TODO fix simultaneous requests

            const EXPECTED_RESULT = {
                "ownerAtoms": [...OWNER_COORDS_LIST.coordsList],
                "competitorAtoms": [...COMPETITOR_COORDS_LIST.coordsList],
                "ownerGuessedCompetitorAtoms": [{x: 4, y: 2}],
                "competitorGuessedOwnerAtoms": [{x: 5, y: 6}],
                "ownerScore": 1,
                "competitorScore": 0,
                "winner": "OWNER"
            };

            await delayedExecution(() => {
                assert.deepEqual(ownerNotifications.at(-1).payload, EXPECTED_RESULT)
                assert.strictEqual(ownerNotifications.at(-1).type, "COMPETITOR_FINISHED")
            }, 10);
            console.info("GAME SUCCESSFULLY FINISHED AND EVERYBODY KNOWS RESULTS OK");


            stompClient.disconnect(function () {
                console.log('Disconnected');
            });
        }
    )
    ;

}

main().then(async r => await r);