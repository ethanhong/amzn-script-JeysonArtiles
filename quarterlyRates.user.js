// ==UserScript==
// @name         QUARTERLY RATES
// @namespace    https://github.com/JeysonArtiles/amzn
// @version      0.2
// @description  QUARTERLY RATES FOR MOST RECENT DAY/NIGHT
// @author       jeyartil / grajef = createButton() + setDate()
// @match        https://aftlite-na.amazon.com/labor_tracking/uph_drilldown*
// @match        https://aftlite-na.amazon.com/login/signin*
// @grant        none
// ==/UserScript==

const autoLog = () => {
    const signIn = document.querySelector("input[name=commit]");
    if (window.location.href.indexOf("/login") != -1) signIn.click();
}

autoLog();

const form = document.querySelector("form");
const func = document.querySelector("input[name=function]");
const zone = document.querySelector("input[name=zone]");
const generateReportButton = document.querySelector("input[name=commit]"); generateReportButton.insertAdjacentHTML("afterend", `<br><br>`);
const columnHeaders = document.querySelector("tr[class=columnHeaders]");
const br = document.createElement("br");

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

zone.value = "--";

form.appendChild(br);

const day = document.createElement('h5');
day.innerHTML = "DAY:&nbsp;";
day.style.display = "inline";
form.appendChild(day);
quarterButtons("DAY");

const night = document.createElement('h5');
night.innerHTML = "&nbsp;&nbsp;&nbsp;NIGHT:&nbsp;";
night.style.display = "inline";
form.appendChild(night);
quarterButtons("NIGHT");

const generateQuarterlyReport = (DAY_NIGHT, QUARTER) => {
    const currentDate = new Date();
    let startDate = new Date();
    let endDate = new Date(startDate);

    let startDayBefore = currentDate.getHours() >= 18 || currentDate.getHours() < 6 ? startDate.getDate() - 1 : startDate.getDate() - 2;
    let startNightBefore = (currentDate.getHours() >= 0 || currentDate.getHours() < 6) && startDate.getDate() - 1;

    const setDates = (DAY_NIGHT, DAY_START, DAY_END, NIGHT_START, NIGHT_END, CALC_DAY, CALC_NIGHT) => {
        if (DAY_NIGHT == "DAY") {
            startDate.setHours(DAY_START); startDate.setDate(CALC_DAY);
            endDate.setHours(DAY_END); endDate.setDate(CALC_DAY);
        } else {
            startDate.setHours(NIGHT_START); startDate.setDate(QUARTER == 5 ? startDayBefore : CALC_NIGHT);
            endDate.setHours(NIGHT_END); endDate.setDate(CALC_NIGHT);
        }
    }

    switch (QUARTER) {
        case 1:
            setDates(DAY_NIGHT, 6, 8, 18, 20, startDayBefore, startDayBefore);
            break;
        case 2:
            setDates(DAY_NIGHT, 9, 11, 21, 23, startDayBefore, startDayBefore);
            break;
        case 3:
            setDates(DAY_NIGHT, 12, 14, 0, 2, startDayBefore, currentDate.getDate());
            break;
        case 4:
            setDates(DAY_NIGHT, 15, 17, 3, 5, startDayBefore, currentDate.getDate());
            break;
        case 5:
            setDates(DAY_NIGHT, 6, 17, 18, 5, startDayBefore, currentDate.getDate());
            break;
        default: alert("broken - disable script");
    }

    setDate(startDate, endDate);
}

//columnHeaders.cells[4].click(); // SORT BY TOP PERFORMERS
//columnHeaders.cells[4].click(); // SORT BY BOTTOM PERFORMERS

