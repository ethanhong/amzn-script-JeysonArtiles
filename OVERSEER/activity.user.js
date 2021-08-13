// ==UserScript==
// @name         [ OVERSEER ] ACTIVITY TRACKER
// @namespace    https://github.com/JeysonArtiles/amzn
// @version      1.0
// @description  TRACK ACTIVITY IN REAL TIME
// @author       JEYARTIL
// @match        https://aftlite-na.amazon.com/labor_tracking/find_people
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/OVERSEER/activity.user.js
// @grant        GM_xmlhttpRequest
// @connect      chime.aws
// ==/UserScript==

sessionStorage.pickSkips1 = JSON.stringify([]);
sessionStorage.pickSkips2 = JSON.stringify([]);

const trackActivity = async (ACTION, EVERY_X_SECONDS) => {
    const formatString = (AA, ITEM, LOCATION) => {
        switch(ACTION) {
            case "skip/pack": return `AA: ${AA} SKIPPED: ${ITEM} LOCATION: ${LOCATION}`;
            case "pack": return `AA: ${AA} PACKED: ${ITEM} LOCATION: ${LOCATION}`;
            case "bcc": return `AA: ${AA} COUNTED: ${ITEM} LOCATION: ${LOCATION}`;
        }
    }

    const fetchFindPeople1 = async () => {
        const RESPONSE = await fetch(`https://aftlite-na.amazon.com/labor_tracking/find_people`);
        const DATA = await RESPONSE.text();
        const PAGE = new DOMParser().parseFromString(DATA, "text/html");

        const table = [...PAGE.querySelectorAll(`#recent_event_table tr`)].slice(2)
        .map(({cells}) => {
            const cell = [...cells];

            const row = {};
            row.msg = {};
            row.eos = {};
            row.person = {};
            row.shift = {};
            row.location = {};
            row.timeSince = {};
            row.time = {};
            row.action = {};
            row.notes = {};
            row.spoo = {};

            row.msg.root = cell[0];
            row.eos.root = cell[1];
            row.person.root = cell[2];
            row.shift.root = cell[3];
            row.location.root = cell[4];
            row.timeSince.root = cell[5];
            row.time.root = cell[6];
            row.action.root = cell[7];
            row.notes.root = cell[8];

            row.person.value = row.person.root.innerText.trim();
            row.shift.value = row.shift.root.innerText.trim();
            row.location.value = row.location.root.innerText.trim();
            row.timeSince.value = row.timeSince.root.innerText.trim();
            row.time.value = row.time.innerText || null;
            row.action.value = row.action.root.innerText.trim();
            row.notes.value = row.notes.root.innerText.trim().split("/")[0] || null;

            return row;
        });

        const result = table.filter(log => log.action.value == ACTION);
        const pickSkipsLog = [...new Map(result.map((item) => [item.person.value, item])).values()];

        let pickSkipsString = pickSkipsLog.map(({location, notes, person}) => formatString(person.value, notes.value, location.value));

        sessionStorage.pickSkips1 = JSON.stringify(pickSkipsString);
    }

    const fetchFindPeople2 = async () => {
        const RESPONSE = await fetch(`https://aftlite-na.amazon.com/labor_tracking/find_people`);
        const DATA = await RESPONSE.text();
        const PAGE = new DOMParser().parseFromString(DATA, "text/html");

        const table = [...PAGE.querySelectorAll(`#recent_event_table tr`)].slice(2)
        .map(({cells}) => {
            const cell = [...cells];

            const row = {};
            row.msg = {};
            row.eos = {};
            row.person = {};
            row.shift = {};
            row.location = {};
            row.timeSince = {};
            row.time = {};
            row.action = {};
            row.notes = {};
            row.spoo = {};

            row.msg.root = cell[0];
            row.eos.root = cell[1];
            row.person.root = cell[2];
            row.shift.root = cell[3];
            row.location.root = cell[4];
            row.timeSince.root = cell[5];
            row.time.root = cell[6];
            row.action.root = cell[7];
            row.notes.root = cell[8];

            row.person.value = row.person.root.innerText.trim();
            row.shift.value = row.shift.root.innerText.trim();
            row.location.value = row.location.root.innerText.trim();
            row.timeSince.value = row.timeSince.root.innerText.trim();
            row.time.value = row.time.innerText || null;
            row.action.value = row.action.root.innerText.trim();
            row.notes.value = row.notes.root.innerText.trim().split("/")[0] || null;

            return row;
        });

        const result = table.filter(log => log.action.value == ACTION);
        const pickSkipsLog = [...new Map(result.map((item) => [item.person.value, item])).values()];

        let pickSkipsString = pickSkipsLog.map(({location, notes, person}) => formatString(person.value, notes.value, location.value));

        sessionStorage.pickSkips2 = JSON.stringify(pickSkipsString);
    }

    setInterval(() => fetchFindPeople1(), EVERY_X_SECONDS * 1000);
    setInterval(() => fetchFindPeople2(), (EVERY_X_SECONDS * 1000) + 1000);

    const update = () => {
        const arr1 = JSON.parse(sessionStorage.pickSkips1);
        const arr2 = JSON.parse(sessionStorage.pickSkips2);

        let unique1 = arr1.filter((o) => arr2.indexOf(o) === -1);
        let unique2 = arr2.filter((o) => arr1.indexOf(o) === -1);

        const unique = unique1.concat(unique2);

        console.log(unique);

        unique.map(skip => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://hooks.chime.aws/incomingwebhooks/0bdacf4c-58d1-4838-a9da-e743bc37a632?token=RDJpUDNkTk98MXxPMHh1b08wQnhxbmlKMThlS0RyMlFNVHBjZzg3ZmpxUF94OFl2RERSQ1Jr",
                data: `{"Content":"${skip}"}`,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    //console.log(response.responseText);
                }
            });
        })
    }
    setInterval(() => update(), (EVERY_X_SECONDS * 1000) + 2000);

}

trackActivity("pack", 5);
