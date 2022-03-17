// ==UserScript==
// @name         AFTLITE UTILITIES UNIFIED
// @namespace    https://github.com/JeysonArtiles/amzn
// @version      0.1
// @description  SCRIPTS FOR AFTLITE
// @author       jeyartil
// @match        https://aftlite-na.amazon.com/*
// @match        https://aftlite-portal.amazon.com/ap/signin*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        GM_xmlhttpRequest
// @connect      chime.aws
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/aftliteUtilitiesUnified.user.js
// @updateURL    https://raw.githubusercontent.com/JeysonArtiles/amzn/master/aftliteUtilitiesUnified.user.js
// ==/UserScript==

function addColumn(TABLE) {
    [...TABLE].forEach((row, i) => {
        const input = document.createElement("input")
        input.setAttribute('type', 'text')
        const cell = document.createElement(i ? "td" : "th")
        cell.appendChild(input)
        row.appendChild(cell)
    });
}

const groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

const say = (SAY, URL) => {
    //const URL = "";
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

const AUTH_TOKEN = document.querySelector("meta[name=csrf-token]").content;
const LOGGED_USER = document.querySelector(".wms-welcome") && document.querySelector(".wms-welcome").innerText.split("(")[1].split(")")[0].toUpperCase().trim();
let FC = document.title.split("]")[0].split("[")[1] || document.querySelector(".wms-name").innerText;
FC = FC.trim();

if(FC == "UNJ1" || FC == "UNY2") { } else { alert(`${FC} is not supported`); }

const hooks = { uny2: {}, unj1: {} };

hooks.uny2.falseSkipTest = "https://hooks.chime.aws/incomingwebhooks/c2e5058a-7487-4ca3-a91c-ff47b77dbb27?token=S2NZZ1JLeVV8MXxQd0RkVS1aWG5hQ0hNU2Y2VjFzTk05bjAtVUgzb2dFaEVKSUVKaEd1dlJB";
hooks.uny2.falseSkip = "https://hooks.chime.aws/incomingwebhooks/dff6d61e-37e3-47b3-bda6-241bf8872987?token=eXJJbW9xNU58MXxuZExEdFhSYm5fbG9ZWktnbGtMU0QzQU1qU1dTUjVqZklHQzNScGpQUVJB";
hooks.uny2.short = "https://hooks.chime.aws/incomingwebhooks/8d6191f1-3905-4a50-8d38-d3aa7707cc5d?token=S21lR1FEc1V8MXx5YTM0THpkZ2VwTlVYbXJzOHZfWXdONTEyYUtvX3gtZWVZYl9KRXlKTzln";

hooks.unj1.falseSkipTest = "https://hooks.chime.aws/incomingwebhooks/77851569-7f16-4247-8d46-9ec2ec315fce?token=OEdpczJNd1h8MXxjTVZKME5MeTd5MngxQkctQzhhcmpFdjFvOGdHODRmODI4VDAzMjhHSEk0";
hooks.unj1.falseSkip = "https://hooks.chime.aws/incomingwebhooks/5bac1380-aad4-4b27-838f-288387eacad4?token=MDdBRktTc3h8MXxqZWFqUGVrRWc3YnU3Y0M5UFVvNWxOemJzUjhDOUNRRlBpRWJheWl4VEdR";
hooks.unj1.short = "https://hooks.chime.aws/incomingwebhooks/1f5eaae4-f8c3-46be-b614-dba9f47fb2e4?token=cFA3WVdZYzN8MXx3YVVNNVd4YWx4V1pDWWx1RFZhaVQwWXZZZ1JLeVpzVE02Zzl1OVpnUmZ3";

const selectHook = (CHAT) => {
    switch(FC) {
        case "UNY2":
            switch(CHAT) {
                case "FALSE_SKIP_TEST": return hooks.uny2.falseSkipTest;
                case "FALSE_SKIP": return hooks.uny2.falseSkip;
                case "SHORT": return hooks.uny2.short;
            }
            break;
        case "UNJ1":
            switch(CHAT) {
                case "FALSE_SKIP_TEST": return hooks.unj1.falseSkipTest;
                case "FALSE_SKIP": return hooks.unj1.falseSkip;
                case "SHORT": return hooks.unj1.short;
            }
            break;
    }
}

!(location.pathname.includes("/login")) && localStorage.setItem("logged_user", LOGGED_USER);
localStorage.setItem("FC", FC);

const inventoryLaborTrack = () => {
    const asin_or_binH2 = document.querySelector("h2").innerText;
    const asin_or_binH2_arr = document.querySelector("h2").innerText.split(" ");
    const asin_or_bin = asin_or_binH2.includes("P-") ? asin_or_binH2_arr[asin_or_binH2_arr.length - 2] : asin_or_binH2_arr[asin_or_binH2_arr.length - 1];

    const loadingText = document.createElement('div');
    loadingText.style.textAlign = 'center';
    loadingText.innerText = "Loading ASIN Labor Tracking."

    setInterval(() => { loadingText.innerText += "." }, 1000);

    loadingText.style.fontWeight = "bold";

    const FORM = document.querySelector('div[style="clear: both;"]');

    FORM.appendChild(loadingText);

    const searchCode = asin_or_bin.includes("P-") ? "location_name" : "asin";
    const trackUrl = `https://aftlite-na.amazon.com/labor_tracking/lookup_history?${searchCode}=${asin_or_bin}`;

    GM_xmlhttpRequest({
        method: "GET",
        url: trackUrl,
        onload: async (response) => {
            const PAGE = new DOMParser().parseFromString(response.responseText, "text/html");
            const TABLE = PAGE.querySelector('.resultSet');
            const TABLE_POINTER = PAGE.querySelector('.reportLayout > tbody');

            FORM.appendChild(TABLE);
            loadingText.hidden = true;

            //const reportLayout = [...tablePointer.children];
            //reportLayout.shift();
        }
    });
}

if (location.pathname.includes("/inventory/view_inventory_")) {
    inventoryLaborTrack();
}

const problemSolve = () => {
    const table = [...document.querySelectorAll("#picklists_table > tbody > tr")];

    const psolveLists = table.filter(tr => tr.cells[2].innerText == "Problem-solve");
    psolveLists.map(tr => { tr.style.backgroundColor = "yellow" });

    const ORDER_ID = [...document.querySelectorAll("#summary_table > tbody > tr")][0].children[1].innerText;
    const PSOLVER = document.querySelector(".wms-welcome").innerText.split("(")[1].split(")")[0].toUpperCase().trim();

    const addToteForm = document.querySelector(`form[action="/wms/set_tote"]`);
    const addToteText = document.querySelector(`input[name="tote_code"]`);
    const addToteBtn = document.querySelector(`form[action="/wms/set_tote"]`);
    const addAsin = document.querySelector(`input[name="asin_or_upc"]`);

    const missing = [...document.querySelectorAll(`tr[valign="top"]`)];

    const totes = [...new Set([...[...document.querySelectorAll("a")].filter(a => a.innerText.includes("Sp"))].map(a => a.innerText))];

    if(totes == "") return;

    addToteText.value = totes;

    missing.map(itm => {
        const item = {};
        item.location = itm.cells[0];
        item.asin = itm.cells[1];
        item.title = itm.cells[2];
        item.weight = itm.cells[3];
        item.picked = itm.cells[4];
        item.packed = itm.cells[5];

        const realWeight = item.weight.innerText;
        item.weight.innerText = item.location.innerText.split("(")[0];

        let PSOLVE_LOCATION = item.weight.innerText;

        if (item.location.innerText.includes("skipped") || item.location.innerText.includes("unknown")) {
            const cubiscanBtn = [...document.querySelectorAll("button")].filter(btn => btn.innerText.includes("Cubiscan"));

            const missingItemCubiscanBtn = cubiscanBtn.filter(btn => btn.previousSibling.previousSibling.value == item.asin.innerText )[0];

            item.location.innerHTML += "<br><button id='falseSkipBtn'>False Skip</button>";
            item.location.innerHTML += "<br><button id='shortBtn'>Short</button>";

            GM_xmlhttpRequest({
                method: "GET",
                url: `https://aftlite-na.amazon.com/labor_tracking/lookup_history?utf8=%E2%9C%93&authenticity_token=${AUTH_TOKEN}&tote_code=${totes}`,
                onload: async (response) => {
                    const PAGE = new DOMParser().parseFromString(response.responseText, "text/html");
                    const TABLE = [...PAGE.querySelectorAll(".reportLayout > tbody > tr")];
                    const PICKER = TABLE[TABLE.length - 1].cells[12].innerText;

                    //console.log(TABLE)

                    const falseSkipBtn = document.querySelector("#falseSkipBtn");

                    const PSOLVE_LOCATION_URL = !PSOLVE_LOCATION.trim().includes("unknown") ? `https://aftlite-na.amazon.com/inventory/view_inventory_at?location_name=${PSOLVE_LOCATION.trim()}` : "";
                    let FALSE_SKIP_LOG = `/md *${PSOLVER}* ➥ [**${PSOLVE_LOCATION.trim()}**](${PSOLVE_LOCATION_URL}) » [**${item.asin.innerText}**](https://aftlite-na.amazon.com/inventory/view_inventory_for_asin?asin=${item.asin.innerText.trim()}) *(${item.title.innerText})* » [**${PICKER.toUpperCase().trim()}**](https://aftlite-na.amazon.com/labor_tracking/lookup_history?user_name=${PICKER.toLowerCase().trim()}) » [* **${totes}** *](https://aftlite-na.amazon.com/wms/pack_by_picklist?utf8=%E2%9C%93&authenticity_token=${AUTH_TOKEN}%3D&picklist_id=${totes}&pack=Pack)`;

                    //const SKIP_URL = "https://hooks.chime.aws/incomingwebhooks/a31525dd-151d-423f-a04b-ec74189d9506?token=VDBJbndTVVN8MXxjWE9vcTZ6VlhTblhXdGFfNTRRY2QtdkN4VXZxc2dwTnNNZWljX1dLSU1j";
                    const SKIP_URL = selectHook("FALSE_SKIP");

                    falseSkipBtn.addEventListener("click", () => {
                        let note = prompt(`False Skip: "${item.title.innerText}"`, "");
                        FALSE_SKIP_LOG += note.length > 0 || note == "null" ? ` » *${note} *` : note;
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: SKIP_URL,
                            data: `{"Content":"${FALSE_SKIP_LOG}"}`,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            onload: function(response) {
                                //console.log(response.responseText);
                            }
                        });

                        item.location.innerHTML = "<span style='color:red; font-weight:bold'>False Skip Reported</span>";
                    })

                    const SHORTED = Number(item.picked.innerText) - Number(item.packed.innerText);

                    const shortBtn = document.querySelector("#shortBtn");

                    const SHORT_LOG_URL = !PSOLVE_LOCATION.trim().includes("unknown") ? `https://aftlite-na.amazon.com/inventory/view_inventory_at?location_name=${PSOLVE_LOCATION.trim()}` : "";
                    let SHORT_LOG = `/md *${PSOLVER}* ➥ [**${PSOLVE_LOCATION.trim()}**](${SHORT_LOG_URL}) » [**${item.asin.innerText}**](https://aftlite-na.amazon.com/inventory/view_inventory_for_asin?asin=${item.asin.innerText.trim()}) *(${item.title.innerText})* » [**${PICKER.toUpperCase().trim()}**](https://aftlite-na.amazon.com/labor_tracking/lookup_history?user_name=${PICKER.toLowerCase().trim()}) » [* **${totes}** *](https://aftlite-na.amazon.com/wms/pack_by_picklist?utf8=%E2%9C%93&authenticity_token=${AUTH_TOKEN}%3D&picklist_id=${totes}&pack=Pack) » **QTY ${SHORTED}**`;

                    //const SHORT_URL = "https://hooks.chime.aws/incomingwebhooks/f3d10f18-0d4b-4f9c-b65c-313ef3d1a48f?token=VUprbmpnNDd8MXxLQk9ITTNWN04ta2x2d1o4OGl1T2hWUjBsSmRkT2RnVVhfd3RHa2xtbXFv";
                    // UNJ1 const SHORT_URL = "https://hooks.chime.aws/incomingwebhooks/1f5eaae4-f8c3-46be-b614-dba9f47fb2e4?token=cFA3WVdZYzN8MXx3YVVNNVd4YWx4V1pDWWx1RFZhaVQwWXZZZ1JLeVpzVE02Zzl1OVpnUmZ3"
                    const SHORT_URL = selectHook("SHORT");

                    shortBtn.addEventListener("click", () => {
                        let note = prompt(`Why are you shorting: "${item.title.innerText}"`, "Not In Stock");
                        SHORT_LOG += note.length > 0 || note == "null" ? ` » *${note} *` : note;
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: SHORT_URL,
                            data: `{"Content":"${SHORT_LOG}"}`,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            onload: function(response) {
                                //console.log(response.responseText);
                            }
                        });

                        item.location.innerHTML = "<span style='color:red; font-weight:bold'>Short Reported</span>";
                    })

                    item.weight.innerText = realWeight;
                }
            });

        }

        const itemName = item.title.innerText;
        const itemAsin = item.asin.innerText;

        const copyAsin = () => { addAsin.value = itemAsin };

        item.title.addEventListener("click", () => copyAsin());
        item.title.innerHTML = `<a href="#">${itemName}</a>`;
    });
}

if (location.pathname.includes("/wms/pack_by_picklist") || location.pathname.includes("/wms/view_order")) {
    problemSolve();
}

const rateReport = () => {
    const table = [...document.querySelectorAll("#labor_summary_table > tbody > tr")];
    const hr = [...document.querySelectorAll("hr")][1];

    const inboundRoles = table.map(tr => {
        const cells = {};
        cells.func = tr.cells[0].innerText.trim();
        cells.zone = tr.cells[1].innerText.trim();
        cells.units = tr.cells[2].innerText.trim();
        cells.duration = tr.cells[3].innerText.trim();
        cells.rate = tr.cells[4].innerText.trim();

        cells.duration = Number(cells.duration).toFixed(2);

        return cells
    }).filter(roles => roles.func == "receive2_direct" || roles.func == "receive_direct" || roles.func == "stow");

    const inboundDiv = document.createElement("div");
    inboundDiv.style.color = "black"

    hr.appendChild(inboundDiv);

    let totalUnits = 0;
    let avgRate = 0;
    let funcTally = 0;
    let totalDuration = 0;
    inboundRoles.map( ({func, zone, units, duration, rate }) => {
        funcTally++;
        inboundDiv.innerHTML += `<b>${func.toUpperCase()}</b> = <b>UNITS:</b> <span style="font-size:20px;font-weight:900px">${units.toUpperCase()}</span> <b>DURATION:</b> <span style="font-size:20px;font-weight:900px">${duration.toUpperCase()}</span> <b>RATE:</b> <span style="font-size:20px;font-weight:900px">${rate.toUpperCase()}</span> <br>`;
        inboundDiv.innerHTML += `<br>`;
        totalUnits += Number(units);
        avgRate += Number(rate)
        totalDuration += Number(duration);
    })
    inboundDiv.innerHTML += `<b>TOTAL UNITS:</b> <span style="font-size:20px;font-weight:900px">${totalUnits}</span> `;
}

if (location.pathname.includes("/labor_tracking/labor_summary")) {
    rateReport();
}

const autoLog = () => {
    const login = localStorage.getItem("logged_user").toLowerCase();
    const password = localStorage.getItem("password") == null && prompt("Enter Password to enable Auto-Login") || localStorage.getItem("password");

    localStorage.setItem("password", password);
    const getPassword = localStorage.getItem("password");

    const inputUsername = document.querySelector('#name') || document.querySelector('#ap_email');
    inputUsername.value = (window.location.href.indexOf("aftlite-portal") != -1) ? `${login}@amazon.com` : login;

    const inputPassword = document.querySelector('#password') || document.querySelector('#ap_password');
    inputPassword.value = getPassword;

    const signIn = document.querySelector("input[name=commit]") || document.querySelector("#signInSubmit");

    if (window.location.href.indexOf("/login") != -1) signIn.click();
    if (window.location.href.indexOf("aftlite-na") || window.location.href.indexOf("aftlite-portal")) signIn.click()

}

if (location.pathname.includes("signin")) {
    localStorage.getItem("logged_user") == "JEYARTIL" && autoLog();
}

const pickAdmin = () => {
    const convertToWindowFormat = window => `${window.split(":")[0] == 24 && "00" || window.split(":")[0]}:00 - ${Number(window.split(":")[0]) + 2}:00`;

    const picklistGroupTable = [...document.querySelectorAll("#wms_orders_in_state > tbody > tr")];

    const picks = [];

    picklistGroupTable.map(tr => {
        const cells = [...tr.cells];

        const picklistId = cells[0];
        const orderId = cells[1];
        const state = cells[2];
        const pickzone = cells[3];
        const orderType = cells[4];
        const numberTotes = cells[5];
        const numberItems = cells[6];
        const user = cells[7];
        const pullTime = cells[8];
        const created = cells[9];
        const updated = cells[10];
        const actions = cells[11];

        const pick = {
            picklistId: { link: picklistId.firstElementChild.href, value: picklistId.innerText },
            orderId: { link: orderId.firstElementChild.firstElementChild.href, value: orderId.innerText },
            internalId: { value: orderId.firstElementChild.firstElementChild.href.split("=")[1] },
            state: { value: state.innerText },
            pickzone: { value: pickzone.innerText },
            orderType: { value: orderType.innerText },
            numberTotes: { value: numberTotes.innerText },
            numberItems: { value: numberItems.innerText },
            user: { value: user.innerText },
            pullTime: { value: pullTime.innerText },
            created: { value: created.innerText },
            updated: { value: updated.innerText },
        };

        picks.push(pick);

    })

    const pickWindowsRaw = picks.map(x => x.pullTime.value);
    const pickWindows = [... new Set(picks.map(x => x.pullTime.value))];
    const picklists = { pullTimes: pickWindows };

    picklists.pullTimes.count = picklists.pullTimes.map(pullTime => {
        return { pullTime, count: pickWindowsRaw.filter(pickWindow => pickWindow === pullTime).length };
    });

    picklists.pullTimes.count = picklists.pullTimes.count.sort((a, b) => Number(a.pullTime.split(" ")[1].split(":")[0]) - Number(b.pullTime.split(" ")[1].split(":")[0]))

    const h1 = document.querySelector("h1");
    const pullTimesDiv = document.createElement("div");
    pullTimesDiv.innerHTML = "<br>";

    picklists.pullTimes.count.map(({pullTime, count}) => {
        pullTimesDiv.innerHTML += `<span style="background-color:#555555; color: white; padding: 5px; font-weight: bold; text-align: center; min-width: 175px; display: inline-block"><b>${convertToWindowFormat(pullTime.split(" ")[1])} = </b> ${count} units</span> &nbsp;`
    })

    h1.append(pullTimesDiv);
}

if (location.pathname.includes("/wms/view_picklists")) {
    pickAdmin();
}

const falseSkipConfirm = () => {
    const table = [...document.querySelectorAll(".reportLayout > tbody > tr")];
    table[0].innerHTML += `<th>False Skip</th>`;
    table.shift();

    let count = 0;
    table.map(x => {
        count++;
        if(count > 500) return;
        x.innerHTML += `<td><button id="falseSkipBtn">CONFIRM</button></td>`;

        const skip = {};
        skip.user = x.cells[0].innerText;
        skip.bin = x.cells[1].innerText;
        skip.asin = x.cells[2].innerText;
        skip.title = x.cells[3].innerText;
        skip.tool = x.cells[4].innerText;
        skip.picklistId = x.cells[5].innerText;
        skip.tiumestamp = x.cells[6].innerText;
        skip.falseSkip = x.cells[7].innerText;

        if(skip.title.includes("8)")) skip.title = skip.title.replace("8)", "8 )");

        x.cells[7].addEventListener("click", () => {
            say(`/md *${localStorage.getItem("logged_user") || LOGGED_USER}* ➥ [**${skip.bin}**](https://aftlite-na.amazon.com/inventory/view_inventory_at?location_name=${skip.bin}) » [**${skip.asin}**](https://aftlite-na.amazon.com/inventory/view_inventory_for_asin?asin=${skip.asin}) *(${skip.title})* » [**${skip.user.toUpperCase()}**](https://aftlite-na.amazon.com/labor_tracking/lookup_history?user_name=${skip.user}) » [* **${skip.picklistId}** *](https://aftlite-na.amazon.com/labor_tracking/lookup_history?picklist_id=${skip.picklistId}) » * **FALSE SKIP CONFIRMED** *`, `${selectHook("FALSE_SKIP")}`)
        })

    });
}

if (location.pathname.includes("skip_history")) {
    falseSkipConfirm();
}
