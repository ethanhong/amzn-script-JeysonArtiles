// ==UserScript==
// @name         UPH Drilldown - Check Rates
// @namespace    mailto:jeyartil@amazon.com
// @version      1.0
// @description  Highlight rates.
// @author       jeyartil
// @match        https://*.amazon.com/labor_tracking/uph_drilldown
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/aftlite_uph.user.js
// @updateURL    https://raw.githubusercontent.com/JeysonArtiles/amzn/master/aftlite_uph.user.js
// ==/UserScript==

(function () {
    "use strict";

    const form = document.querySelector("form");
    const authToken = form[1].value.replace(/[^a-z0-9]/gi, "");
    const start = { month: form[2], day: form[3], year: form[4], hour: form[5] };
    const end = { month: form[6], day: form[7], year: form[8], hour: form[9] };
    const path = form[10];
    const zone = form[11];
    const submit = form[12];

    // DEFAULT
    zone.value = "--";

    document.onkeyup = function (e) {
        if (e.shiftKey && e.which == 82) {
            checkRate();
        }
        if (e.shiftKey && e.which == 13) {
            form.submit();
        }
    };

    let pickers = [...document.querySelectorAll("tbody")][1];

    localStorage.currentRate = Number(
        Number([...document.querySelectorAll("tr>td")].slice(2, 8)[1].innerText).toFixed(3)
    );
    localStorage.currentUnits = Number(
        Number([...document.querySelectorAll("tr>td")].slice(2, 8)[3].innerText).toFixed(3)
    );

    localStorage.pickersCount = "--";
    pickers.innerHTML += `<td id='rateTitle'></td><td id="rateValue"></td>`;

    let defaultRate;

    const updateThings = () => {
        const rateValue = document.querySelector("#rateValue").innerText;

        switch (path.value.toLowerCase()) {
            case "pack":
                document.querySelector("#rateTitle").innerText = "Pickers";
                defaultRate = 70;
                break;
            case "bcc":
                document.querySelector("#rateTitle").innerText = "Counters";
                defaultRate = 200;
                break;
            case "receive_direct":
                document.querySelector("#rateTitle").innerText = "Stowers";
                defaultRate = 180;
                break;
            case "receive2_direct":
                document.querySelector("#rateTitle").innerText = "Stowers";
                defaultRate = 180;
                break;
            case "stow":
                document.querySelector("#rateTitle").innerText = "Stowers";
                defaultRate = 200;
                break;
            default:
                document.querySelector("#rateTitle").innerText = "AA's";
                break;
        }
    };

    const checkRate = () => {
        updateThings();

        let rate = prompt("Desired Rate", defaultRate || 70);
        if(rate == null) return;

        let table = [...document.querySelectorAll("tr>td")].slice(2, 8);

        let par = {};
        par.rate = {
            pointer: table[1],
            value: Number(Number(table[1].innerText).toFixed(3)),
        };

        par.units = {
            pointer: table[3],
            value: Number(Number(table[3].innerText).toFixed(3)),
        };
        par.duration = {
            title: table[4],
            pointer: table[5],
            value: Number(Number(table[5].innerText).toFixed(3)),
        };

        let expected_units = par.duration.value * rate;
        let expected_rate = (expected_units / par.duration.value).toFixed(0);

        par.rate.pointer.innerHTML = `<b>${localStorage.currentRate}</b> / ${expected_rate}`;
        par.units.pointer.innerHTML = `<b>${localStorage.currentUnits}</b> / ${expected_units}`;
        par.duration.pointer.innerHTML = `<b>${par.duration.value}</b>`;

        let aa = [...document.querySelectorAll(`tr[id=${path.value}]`)];

        let count = 0;
        let onTrack = 0;
        let offTrack = 0;
        aa.map((picker) => {
            // console.log(picker.cells);
            count++;

            let aa = {};
            aa.name = { root: picker.cells[0], value: picker.cells[0].innerText };

            aa.agency = { root: picker.cells[1], value: picker.cells[1].innerText };
            aa.units = { root: picker.cells[2], value: Number(picker.cells[2].innerText) };
            aa.hours = {
                root: picker.cells[3],
                value: Number(picker.cells[3].innerText.split(" ")[0]),
            };
            aa.rate = { root: picker.cells[4], value: Number(picker.cells[4].innerText) };

            //if (aa.hours.value < 0.5) console.log(aa.name.value, aa.rate.value, rate)

            //				aa.hours.value < (rate / aa.hours.value) &&
            if (aa.rate.value < rate || (aa.rate.value < rate && aa.hours.value > 0.5)) {
                offTrack++;
                // aa.units.root.innerText += " (slow)";
                picker.style.backgroundColor = "#F38BA0";
                picker.setAttribute("class", "blink_me");
            } else {
                onTrack++;
                picker.style.backgroundColor = "#ACFFAD";
                picker.removeAttribute("blink_me");
            }
        });

        document.querySelector(
            "#rateValue"
        ).innerHTML = `<b>${count} ( <span style="color: green">${onTrack}⇑</span> / <span style="color: red">${offTrack}⇓</span> )</b>`;

        const columnHeaders = document.querySelector("tr.columnHeaders");
        const ratePerHourHeader = columnHeaders.cells[4];

        ratePerHourHeader.click();
    };
})();
