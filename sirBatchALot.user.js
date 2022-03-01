// ==UserScript==
// @name         SIR BATCH A LOT
// @namespace    https://github.com/JeysonArtiles/amzn
// @version      0.1
// @description  BATCHING ALERTS @ T+5 & T+25
// @author       You
// @match        https://como-operations-dashboard-iad.iad.proxy.amazon.com/store/8064dfb4-ec83-417e-8dcf-089c0e72ea22/dash
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        GM_xmlhttpRequest
// @connect      chime.aws
// ==/UserScript==

const say = (SAY) => {
    const URL = "https://hooks.chime.aws/incomingwebhooks/976cb229-03c6-4e9c-a794-0ba2ce2fd57c?token=REpycXNWMnV8MXw4WWtHM3Boc2tOUGZHdENYcGRFXzg5d3hqc09TelRkc1dZZ3ZfQjZyZlRv";

    GM_xmlhttpRequest({
        method: "POST",
        url: URL,
        data: `{"Content":"${SAY}"}`,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            //console.log(response.responseText);
        }
    });
}

let count = 0;
const talk = () => {
    const today = new Date();
    const time = {};

    time.hrs = today.getHours();
    time.min = today.getMinutes();
    time.sec = today.getSeconds();

    time.now = Number(`${time.hrs}${time.min}`);
    console.log(`${time.hrs}:${time.min}:${time.sec}`);

    if (time.now > 400 && time.min == 5 || time.now < 2200 & time.min == 25) {
        say("/md @Present **BATCH STAFFING** 🠶 PLEASE ENSURE YOUR BATCHERS ARE STAFFED PROPERLY");
        count++;
    }
}


setInterval(() => talk(), 59000);
