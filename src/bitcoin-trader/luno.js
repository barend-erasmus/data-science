const WebSocket = require("ws");

function dataStream(callback, keyId, secret) {
  let currentAsk = 0;
  let currentBid = 0;

  let previousAsk = 0;
  let previousBid = 0;

  const webSocket = new WebSocket("wss://ws.luno.com/XBTZAR");

  webSocket.on("open", () => {
    webSocket.send(
      JSON.stringify({
        api_key_id: keyId,
        api_key_secret: secret
      })
    );
  });

  webSocket.on("message", data => {
    const obj = JSON.parse(data);

    if (!obj || !obj.create_update) {
      return;
    }

    switch (obj.create_update.type) {
      case "ASK":
        currentAsk = obj.create_update.price;
        break;
      case "BID":
        currentBid = obj.create_update.price;
    }

    callback(null, {
      askGrowth: ((currentAsk - previousAsk) / previousAsk) * 100,
      bidGrowth: ((currentBid - previousBid) / previousBid) * 100,
      currentAsk,
      currentBid,
      previousAsk,
      previousBid
    });

    previousAsk = currentAsk;
    previousBid = currentBid;
  });
}

module.exports = {
  dataStream
};
