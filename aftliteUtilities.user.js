// ==UserScript==
// @name         AFTLITE UTILITIES
// @namespace    https://github.com/JeysonArtiles/amzn
// @version      0.1
// @description  Many scripts; Load ASIN Labor Track / Get PA Number ASIN + Receive
// @author       jeyartil
// @match        https://aftlite-na.amazon.com/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        GM_xmlhttpRequest
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
    }
                      )


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
    const addToteForm = document.querySelector(`form[action="/wms/set_tote"]`);
    const addToteText = document.querySelector(`input[name="tote_code"]`);
    const addToteBtn = document.querySelector(`form[action="/wms/set_tote"]`);

    const addAsin = document.querySelector(`input[name="asin_or_upc"]`);
    //
    const missing = [...document.querySelectorAll(`tr[valign="top"]`)];

    //const test = document.querySelector(`form[action="/wms/finish_packing_picklist"]`);
    //const barcodeDiv = document.createElement(`div`);

    //barcodeDiv.innerHTMl = "TEST"

    //test.appendChild(barcodeDiv)
    const totes = [...new Set([...[...document.querySelectorAll("a")].filter(a => a.innerText.includes("Sp"))].map(a => a.innerText))];

    addToteText.value = totes;

    missing.map(item => {
        const itm = {};
        itm.location = item.cells[0];
        itm.asin = item.cells[1];
        itm.title = item.cells[2];
        itm.weight = item.cells[3];
        itm.picked = item.cells[4];
        itm.packed = item.cells[5];

        const itemName = itm.title.innerText;
        const itemAsin = itm.asin.innerText;

        const copyAsin = () => { addAsin.value = itemAsin };

        itm.title.addEventListener("click", () => copyAsin());
        itm.title.innerHTML = `<a href="#">${itemName}</a>`;
    });

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
