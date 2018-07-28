const luno = require("./luno");
const fs = require("fs").promises;

// 109 800

let count = 0;

luno.dataStream((error, obj) => {
    fs.appendFile('bitcoin-trader.csv', `${toFixedLength(obj.currentAsk)}${toFixedLength(obj.currentBid)}${toFixedLength(obj.previousAsk)}${toFixedLength(obj.previousBid)}${toFixedLength(obj.askGrowth)}${toFixedLength(obj.bidGrowth)}\r\n`);

    count ++;

    console.log(count);
}, "f6fvu6e4fecrq", "jmramhu7YyL8QItnnshBgrZ1xnbFbnbaE0Ih90Gr6uU");

function toFixedLength(value) {
    let str = (Math.round(value * 100) / 100).toString();

    const length = 10;

    for (let count = str.length; count < length; count ++) {
        str += ' ';
    }

    if (str.length > length) {
        str = str.substring(0, length);
    }

    return str;
}