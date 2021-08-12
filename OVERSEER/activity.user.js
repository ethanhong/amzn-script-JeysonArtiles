// ==UserScript==
// @name         [ OVERSEER ] ACTIVITY TRACKER
// @namespace    https://github.com/JeysonArtiles/amzn
// @version      0.8
// @description  TRACK ACTIVITY IN REAL TIME
// @author       JEYARTIL
// @match        https://*.amazon.com/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/OVERSEER/activity.user.js
// @grant        GM_xmlhttpRequest
// @connect      chime.aws
// ==/UserScript==

// 0.6 AWESOME
const name = "this is 0.8";

const trackActivity = async (action) => {

}

GM_xmlhttpRequest({
    method: "POST",
    url: "https://hooks.chime.aws/incomingwebhooks/0bdacf4c-58d1-4838-a9da-e743bc37a632?token=RDJpUDNkTk98MXxPMHh1b08wQnhxbmlKMThlS0RyMlFNVHBjZzg3ZmpxUF94OFl2RERSQ1Jr",
    data: `{"Content":"Hello ${name}. Nice to see you."}`,
    headers: {
        "Content-Type": "application/json"
    },
    onload: function(response) {
        console.log(response.responseText);
    }
});