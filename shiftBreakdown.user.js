// ==UserScript==
// @name         SHIFT BREAKDOWN
// @namespace    https://github.com/JeysonArtiles/amzn
// @version      1.0
// @description  Q1 / Q2 /Q3 /Q4 / FULL SHIFT
// @author       jeyartil / grajef = createButton() + setDate()
// @match        https://aftlite-na.amazon.com/labor_tracking/uph_drilldown*
// @match        https://aftlite-na.amazon.com/labor_tracking/view_daily_detail*
// @match        https://aftlite-na.amazon.com/labor_tracking/labor_summary
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/shiftBreakdown.user.js
// @grant        none
// ==/UserScript==

const form = document.querySelector("form");
const func = document.querySelector("input[name=function]");
const zone = document.querySelector("input[name=zone]");
const generateReportButton = document.querySelector("input[name=commit]"); generateReportButton.insertAdjacentHTML("afterend", `<br><br>`);
const columnHeaders = document.querySelector("tr[class=columnHeaders]");
const br = document.createElement("br");

if (zone) {
    zone.value = "--";
}

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ grajef ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
const createButton = (name) => {
    const button = document.createElement('button');
    button.innerHTML = name;
    form.appendChild(button);
    return button;
}

const setDate = (start, end) => {
    document.getElementById("date_start_hour").selectedIndex = start.getHours();
    document.getElementById("date_start_day").value = start.getDate();
    document.getElementById("date_start_month").selectedIndex = start.getMonth();
    document.getElementById("date_start_year").value = start.getFullYear();
    document.getElementById("date_end_hour").selectedIndex = end.getHours();
    document.getElementById("date_end_day").value = end.getDate();
    document.getElementById("date_end_month").selectedIndex = end.getMonth();
    document.getElementById("date_end_year").value = end.getFullYear();
}
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ grajef ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

const quarterButtons = (DAY_NIGHT) => {
    createButton("Q1").onclick = () => generateQuarterlyReport(DAY_NIGHT, 1);
    createButton("Q2").onclick = () => generateQuarterlyReport(DAY_NIGHT, 2);
    createButton("Q3").onclick = () => generateQuarterlyReport(DAY_NIGHT, 3);
    createButton("Q4").onclick = () => generateQuarterlyReport(DAY_NIGHT, 4);
    createButton("FULL").onclick = () => generateQuarterlyReport(DAY_NIGHT, 5);
}

form.appendChild(br);

const day = document.createElement('h5');
day.innerHTML = "DAY:&nbsp;";
day.style.display = "inline";
form.appendChild(day);
quarterButtons("DAY");

const night = document.createElement('h5');
night.innerHTML = "&nbsp;&nbsp;NIGHT:&nbsp;";
night.style.display = "inline";
form.appendChild(night);
quarterButtons("NIGHT");

if (zone) {
    const path = document.createElement('h5');
    path.innerHTML = "FUNCTION:&nbsp;";
    path.style.display = "inline";
    form.insertAdjacentHTML("beforeend", "<br>");
    form.appendChild(path);
    createButton("RECEIVE 1").onclick = () => { func.value = "receive_direct"; }
    createButton("RECEIVE 2").onclick = () => { func.value = "receive2_direct"; }
    createButton("STOW").onclick = () => { func.value = "stow"; }
    createButton("PACK").onclick = () => { func.value = "pack"; }
    createButton("BCC").onclick = () => { func.value = "bcc"; }
    createButton("BATCHING").onclick = () => { func.value = "BATCHING"; }
    createButton("TIMEOFFTASK").onclick = () => { func.value = "TIMEOFFTASK"; }
    createButton("IDLE").onclick = () => { func.value = "IDLE"; }
    createButton("BRK").onclick = () => { func.value = "BRK"; }

    const tempZone = document.createElement('h5');
    tempZone.innerHTML = "ZONE:&nbsp;";
    tempZone.style.display = "inline";
    form.insertAdjacentHTML("beforeend", "<br>");
    form.appendChild(tempZone);
    createButton("AMBIENT").onclick = () => { zone.value = "ambient"; }
    createButton("CHILLED").onclick = () => { zone.value = "chilled"; }
    createButton("FROZEN").onclick = () => { zone.value = "frozen"; }
    createButton("PRODUCE").onclick = () => { zone.value = "produce"; }
}





const generateQuarterlyReport = (DAY_NIGHT, QUARTER) => {
    const currentDate = new Date();
    let startDate = new Date();
    let endDate = new Date(startDate);

    const setDates = (DAY_NIGHT, DAY_START, DAY_END, NIGHT_START, NIGHT_END, CALC_DAY, CALC_NIGHT) => {
        const shift = {};
        shift.day = currentDate.getHours() >= 6 && currentDate.getHours() < 18;
        shift.night = currentDate.getHours() >= 18 && currentDate.getHours() < 6;
        shift.nightFirstHalf = currentDate.getHours() >= 18 && currentDate.getHours() < 24;
        shift.nightSecondHalf = currentDate.getHours() >= 0 && currentDate.getHours() < 6;

        shift.q1 = QUARTER == 1;
        shift.q2 = QUARTER == 2;
        shift.q3 = QUARTER == 3;
        shift.q4 = QUARTER == 4;
        shift.full = QUARTER == 5;

        const checkQ3Q4FirstHalf = (shift.q3 || shift.q4) && shift.nightFirstHalf;

        let CALC_DAY_START = CALC_DAY; let CALC_DAY_END = CALC_DAY;
        let CALC_NIGHT_START = CALC_NIGHT; let CALC_NIGHT_END = CALC_NIGHT;

        if (DAY_NIGHT == "DAY") {
            if (shift.nightSecondHalf) { CALC_DAY_START--; CALC_DAY_END--; }

            startDate.setDate(CALC_DAY_START); startDate.setHours(DAY_START);
            endDate.setDate(CALC_DAY_END); endDate.setHours(DAY_END);
        }

        if (DAY_NIGHT == "NIGHT") {
            if (shift.nightFirstHalf && (shift.q3 || shift.q4)) { CALC_NIGHT_START++; CALC_NIGHT_END++; }
            else if (shift.nightSecondHalf && (shift.q1 || shift.q2)) { CALC_NIGHT_START--; CALC_NIGHT_END--; }
            else if (shift.nightSecondHalf && shift.full) { CALC_NIGHT_START--; }
            else if (shift.nightFirstHalf && shift.full) { CALC_NIGHT_END++; }
            else if (shift.day && (shift.q1 || shift.q2)) { CALC_NIGHT_START--; CALC_NIGHT_END--; }
            else if (shift.day && (shift.full)) { CALC_NIGHT_START--; }

            startDate.setDate(CALC_NIGHT_START); startDate.setHours(NIGHT_START);
            endDate.setDate(CALC_NIGHT_END); endDate.setHours(NIGHT_END);
        }

    }

    switch (QUARTER) {
        case 1:
            setDates(DAY_NIGHT, 6, 8, 18, 20, currentDate.getDate(), currentDate.getDate());
            break;
        case 2:
            setDates(DAY_NIGHT, 9, 11, 21, 23, currentDate.getDate(), currentDate.getDate());
            break;
        case 3:
            setDates(DAY_NIGHT, 12, 14, 0, 2, currentDate.getDate(), currentDate.getDate());
            break;
        case 4:
            setDates(DAY_NIGHT, 15, 17, 3, 5, currentDate.getDate(), currentDate.getDate());
            break;
        case 5:
            setDates(DAY_NIGHT, 6, 17, 18, 5, currentDate.getDate(), currentDate.getDate());
            break;
        default: alert("broken - disable script");
    }

    setDate(startDate, endDate);
}

//columnHeaders.cells[4].click(); // SORT BY TOP PERFORMERS
//columnHeaders.cells[4].click(); // SORT BY BOTTOM PERFORMERS
