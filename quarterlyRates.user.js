// ==UserScript==
// @name         QUARTERLY RATES
// @namespace    https://github.com/JeysonArtiles/amzn
// @version      0.2
// @description  Get Quarterly Rates
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
    let startDate = new Date();
    let endDate = new Date(startDate);

    startDate.setDate((startDate.getHours() >= 0 && startDate.getHours() < 18) && startDate.getDate() - 1);
    endDate.setDate((endDate.getHours() >= 0 && endDate.getHours() < 18) && endDate.getDate() - 1);

    switch (QUARTER) {
        case 1:
            DAY_NIGHT == "DAY" && startDate.setHours(6) || startDate.setHours(18);
            DAY_NIGHT == "DAY" && endDate.setHours(8) || endDate.setHours(20);
            break;
        case 2:
            DAY_NIGHT == "DAY" && startDate.setHours(9) || startDate.setHours(21);
            DAY_NIGHT == "DAY" && endDate.setHours(11) || endDate.setHours(23);
            break;
        case 3:
            DAY_NIGHT == "DAY" && startDate.setHours(12) || startDate.setHours(0);
            DAY_NIGHT == "DAY" && endDate.setHours(14) || endDate.setHours(2);
            break;
        case 4:
            DAY_NIGHT == "DAY" && startDate.setHours(15) || startDate.setHours(3);
            DAY_NIGHT == "DAY" && endDate.setHours(17) || endDate.setHours(5);
            DAY_NIGHT == "NIGHT" && endDate.setDate(endDate.getDate() + 1);
            break;
            case 5:
            DAY_NIGHT == "DAY" && startDate.setHours(6) || startDate.setHours(18);
            DAY_NIGHT == "DAY" && endDate.setHours(17) || endDate.setHours(5);
            DAY_NIGHT == "NIGHT" && endDate.setDate(endDate.getDate() + 1);
            break;
        default: break;
    }

    setDate(startDate, endDate);
}

//columnHeaders.cells[4].click(); // SORT BY TOP PERFORMERS
//columnHeaders.cells[4].click(); // SORT BY BOTTOM PERFORMERS

