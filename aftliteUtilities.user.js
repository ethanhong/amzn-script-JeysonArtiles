// ==UserScript==
// @name         AFTLITE UTILITIES
// @namespace    https://github.com/JeysonArtiles/amzn
// @version      0.3
// @description  Many scripts; Load ASIN Labor Track / Get PA Number ASIN + Receive
// @author       jeyartil
// @match        https://aftlite-na.amazon.com/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        GM_xmlhttpRequest
// @connect      chime.aws
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @require      https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/barcodes/JsBarcode.code128.min.js
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/aftliteUtilities.user.js
// ==/UserScript==

/*
hotkeys('shift+/', function() {
    const script = prompt(`==========\nSCRIPT STATUS\n==========\n\nEnter a number to toggle ON/OFF
    \n1. ASIN LABOR TRACK: ${localStorage.asinLaborTrack}`).toUpperCase();

    switch(script) {
        case "1": localStorage.asinLaborTrack = !localStorage.asinLaborTrack || true;
            break;
        default: alert("teet")
            break;
    }

    //if (script == null) return;
});
*/

const AUTH_TOKEN = document.querySelector("meta[name=csrf-token]").content;

const findPalletAsin = () => {
    const purchaseOrders = [...document.querySelectorAll(`#sortable-table-0 > tbody > tr`)];

    purchaseOrders.map(tr => {
        const cells = [...tr.cells];
        const po = cells[0];
        const vendor = cells[1];
        const quantityLeft = cells[2];
        const lastVendorShip = cells[3];

        const PO = po.innerText;

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://aftlite-na.amazon.com/dock_receive/pallets?receivable_order_id=${PO}`,
            onload: async (response) => {
                const PAGE = new DOMParser().parseFromString(response.responseText, "text/html");
                const TABLE = PAGE.querySelector('.resultSet');
                const TABLE_POINTER = [...PAGE.querySelectorAll('.reportLayout > tbody > tr')];

                let palletIds = [];

                console.log(TABLE)

                TABLE_POINTER.map(tr => {
                    const cells = [...tr.cells];
                    const palletId = cells[0];
                    const category = cells[1];
                    const location = cells[2];
                    const status = cells[3];
                    const temperature = cells[4];
                    const lastUpdated = cells[5];

                    const pa = ` ${category.innerText.toUpperCase()} = <b>${palletId.innerText}</b>`;

                    palletIds.push(pa);
                })

                po.innerHTML = `<span style="color:#404040">${po.innerText}</span> <br> ${palletIds}`;
            }
        });
    })
}

const findPalletReceive = () => {
    const purchaseOrders = [...document.querySelectorAll(`#received_pos > tbody > tr`)];

    const today = new Date().getDate();

    purchaseOrders.map(tr => {
        const cells = [...tr.cells];
        const po = cells[0];
        const vendor = cells[1];
        const name = cells[2];
        const receiver = cells[3];
        const receiveTime = cells[4];

        const PO = po.innerText;

        const receiveDate = Number(receiveTime.innerText.split(", ")[1].split(" ")[0]);

        receiveDate > (today - 7) && GM_xmlhttpRequest({
            method: "GET",
            url: `https://aftlite-na.amazon.com/dock_receive/pallets?receivable_order_id=${PO}`,
            onload: async (response) => {
                const PAGE = new DOMParser().parseFromString(response.responseText, "text/html");
                const TABLE = PAGE.querySelector('.resultSet');
                const TABLE_POINTER = [...PAGE.querySelectorAll('.reportLayout > tbody > tr')];

                let palletIds = [];
                let discarded = 0;

                TABLE_POINTER.map(tr => {
                    const cells = [...tr.cells];
                    const palletId = cells[0];
                    const category = cells[1];
                    const location = cells[2];
                    const status = cells[3];
                    const temperature = cells[4];
                    const lastUpdated = cells[5];

                    const pa = ` ${category.innerText.toUpperCase()} = <b>${palletId.innerText}</b>`;

                    status.innerText != "DISCARDED" && palletIds.push(pa);
                    const discarded = status.innerText == "DISCARDED" && ``
                })

                po.innerHTML = `<span style="color:#404040">${po.innerText}</span> <br> ${palletIds} ${discarded > 0 ? discarded : ""}`;
            }
        });
    }
                      )


}

const asinLaborTrack = () => {
    const asinH2 = document.querySelector("h2").innerText.split(" ");
    const ASIN = asinH2[asinH2.length - 1];

    const loadingText = document.createElement('div');
    loadingText.style.textAlign = 'center';
    loadingText.innerText = "Loading ASIN Labor Tracking."

    setInterval(() => { loadingText.innerText += "." }, 1000);

    loadingText.style.fontWeight = "bold";

    const FORM = document.querySelector('div[style="clear: both;"]');

    FORM.appendChild(loadingText);

    GM_xmlhttpRequest({
        method: "GET",
        url: `https://aftlite-na.amazon.com/labor_tracking/lookup_history?asin=${ASIN}`,
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

const problemSolve = () => {
    const ORDER_ID = [...document.querySelectorAll("#summary_table > tbody > tr")][0].children[1].innerText;
    const PSOLVER = document.querySelector(".wms-welcome").innerText.split("(")[1].split(")")[0].toUpperCase().trim();

    const addToteForm = document.querySelector(`form[action="/wms/set_tote"]`);
    const addToteText = document.querySelector(`input[name="tote_code"]`);
    const addToteBtn = document.querySelector(`form[action="/wms/set_tote"]`);
    const addAsin = document.querySelector(`input[name="asin_or_upc"]`);

    const missing = [...document.querySelectorAll(`tr[valign="top"]`)];

    const totes = [...new Set([...[...document.querySelectorAll("a")].filter(a => a.innerText.includes("Sp"))].map(a => a.innerText))];

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

                    console.log(TABLE)

                    const falseSkipBtn = document.querySelector("#falseSkipBtn");

                    const PSOLVE_LOCATION_URL = !PSOLVE_LOCATION.trim().includes("unknown") ? `https://aftlite-na.amazon.com/inventory/view_inventory_at?location_name=${PSOLVE_LOCATION.trim()}` : "";
                    let FALSE_SKIP_LOG = `/md [** * ${PSOLVER} * **]() » [**${PSOLVE_LOCATION.trim()}**](${PSOLVE_LOCATION_URL}) » [**${item.asin.innerText}**](https://aftlite-na.amazon.com/inventory/view_inventory_for_asin?asin=${item.asin.innerText.trim()}) *(${item.title.innerText})* » [**${PICKER.toUpperCase().trim()}**](https://aftlite-na.amazon.com/labor_tracking/lookup_history?user_name=${PICKER.toLowerCase().trim()}) » [* **${totes}** *](https://aftlite-na.amazon.com/wms/pack_by_picklist?utf8=%E2%9C%93&authenticity_token=${AUTH_TOKEN}%3D&picklist_id=${totes}&pack=Pack)`;

                    //const SKIP_URL = "https://hooks.chime.aws/incomingwebhooks/a31525dd-151d-423f-a04b-ec74189d9506?token=VDBJbndTVVN8MXxjWE9vcTZ6VlhTblhXdGFfNTRRY2QtdkN4VXZxc2dwTnNNZWljX1dLSU1j";
                    const SKIP_URL = "https://hooks.chime.aws/incomingwebhooks/5bac1380-aad4-4b27-838f-288387eacad4?token=MDdBRktTc3h8MXxqZWFqUGVrRWc3YnU3Y0M5UFVvNWxOemJzUjhDOUNRRlBpRWJheWl4VEdR";

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
                    let SHORT_LOG = `/md [** * ${PSOLVER} * **]() » [**${PSOLVE_LOCATION.trim()}**](${SHORT_LOG_URL}) » [**${item.asin.innerText}**](https://aftlite-na.amazon.com/inventory/view_inventory_for_asin?asin=${item.asin.innerText.trim()}) *(${item.title.innerText})* » [**${PICKER.toUpperCase().trim()}**](https://aftlite-na.amazon.com/labor_tracking/lookup_history?user_name=${PICKER.toLowerCase().trim()}) » [* **${totes}** *](https://aftlite-na.amazon.com/wms/pack_by_picklist?utf8=%E2%9C%93&authenticity_token=${AUTH_TOKEN}%3D&picklist_id=${totes}&pack=Pack) » **QTY ${SHORTED}**`;

                    //const SHORT_URL = "https://hooks.chime.aws/incomingwebhooks/a31525dd-151d-423f-a04b-ec74189d9506?token=VDBJbndTVVN8MXxjWE9vcTZ6VlhTblhXdGFfNTRRY2QtdkN4VXZxc2dwTnNNZWljX1dLSU1j";
                    const SHORT_URL = "https://hooks.chime.aws/incomingwebhooks/1f5eaae4-f8c3-46be-b614-dba9f47fb2e4?token=cFA3WVdZYzN8MXx3YVVNNVd4YWx4V1pDWWx1RFZhaVQwWXZZZ1JLeVpzVE02Zzl1OVpnUmZ3"

                    shortBtn.addEventListener("click", () => {
                        let note = prompt(`Why are you shorting "${item.title.innerText}}"`, "Not In Stock");
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

const closePallet = () => {

    GM_xmlhttpRequest({
        method: "GET",
        url: `https://aftlite-na.amazon.com/dock_receive/view_nyr_pallets`,
        onload: async (response) => {
            const PAGE = new DOMParser().parseFromString(response.responseText, "text/html");
            const TABLE = [...PAGE.querySelectorAll("#nyr_pallets > tbody > tr")];

            TABLE.map(tr => {
                const palletId = tr.cells[0];
                const po = tr.cells[0];
                const category = tr.cells[0];
                const location = tr.cells[0];
                const status = tr.cells[0];
                const lastUpdated = tr.cells[0];
                const close = tr.cells[0];
            })
        }
    });
}

const highlightPsolve = () => {
    const table = [...document.querySelectorAll("#picklists_table > tbody > tr")];
    const psolveLists = table.filter(tr => tr.cells[2].innerText == "Problem-solve");
    psolveLists.map(tr => { tr.style.backgroundColor = "yellow" });

    console.log(psolveLists)
}

const showPoQty = () => {
    const PO = document.querySelector("hr").nextSibling.textContent.split("[")[1].split("]")[0];
    console.log(PO)

    const loadingText = document.createElement('div');
    loadingText.style.textAlign = 'center';
    loadingText.innerText = "Loading ASIN Labor Tracking."

    setInterval(() => { loadingText.innerText += "." }, 1000);

    loadingText.style.fontWeight = "bold";

    const FORM = document.querySelector('form[action="/po_report/index"]');

    FORM.appendChild(loadingText);

    GM_xmlhttpRequest({
        method: "GET",
        url: `https://aftlite-na.amazon.com/dock_receive/reconcile_shorts_overages?po=${PO}`,
        onload: async (response) => {
            const PAGE = new DOMParser().parseFromString(response.responseText, "text/html");
            const TABLE = PAGE.querySelector('table[id="Still Unpacking"]');
            const TABLE_POINTER = PAGE.querySelector('.reportLayout > tbody');
            console.log(TABLE_POINTER)

            FORM.appendChild(TABLE);
            loadingText.hidden = true;

            //const reportLayout = [...tablePointer.children];
            //reportLayout.shift();
        }
    });


}


if (location.pathname.includes("/po_report")) {
    showPoQty();
}

if (location.pathname.includes("/wms/view_order")) {
    highlightPsolve();
}

if (location.pathname.includes("/labor_tracking/labor_summary")) {
    rateReport();
}

if (location.pathname.includes("/dock_receive/view_received")) {
    findPalletReceive();
}

if (location.pathname.includes("/receive/pos_by_asin")) {
    findPalletAsin();
}

if (location.pathname.includes("/inventory/view_inventory_for_asin")) {
    asinLaborTrack();
}

if (location.pathname.includes("/wms/pack_by_picklist")) {
    problemSolve();
}
