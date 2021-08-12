// ==UserScript==
// @name         WebHook Test
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://aftlite-na.amazon.com/wms/index
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/pick_skip.user.user.js
// @grant        GM_xmlhttpRequest
// @connect      chime.aws
// ==/UserScript==

const name = prompt("Enter your name:");

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