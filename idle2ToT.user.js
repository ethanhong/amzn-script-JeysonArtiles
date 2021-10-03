// ==UserScript==
// @name         Idle To Time Off Task
// @namespace    https://github.com/JeysonArtiles
// @version      0.1
// @description  Automatically convert IDLE to TIME OFF TASK
// @author       Jeyson Artiles
// @m1atch        https://*.amazon.com/labor_tracking/view_daily_detail
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @require      https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// ==/UserScript==

localStorage.exempt = "";

hotkeys('shift+e', function (event, handler){
    switch (handler.key) {
        case 'shift+e': {
            const exempt = prompt("Enter username to exempt from TOT", "");
            if (exempt) return;
            localStorage.exempt += JSON.stringify(exempt);
        };
            break;
        default: break;
    }
});

const table = document.querySelectorAll('#dailyReportTable > tbody > tr');
let filterAA = [...table].filter(aa => aa.cells[4].innerText == "FC Associate");

//TEST LIMITER
filterAA = [...table].filter(aa => aa.cells[0].innerText == "123");

const eligibleAA = filterAA.filter(aa => aa.cells[7].attributes[0]);
const totAA = eligibleAA.map(aa => {
    aa.cells[7].firstElementChild[2][14].selected = false;
    aa.cells[7].firstElementChild[2][25].selected = true;
})

console.log(filterAA);
