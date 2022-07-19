const ifp = (pathname, func) => {
    if (location.pathname.includes(pathname)) () => func;
}

const parse = { table: {} };

parse.dateTime = (date_string) => {
            const date = { raw: date_string.split(" ")[0], string: date_string };
            date.parsed = date.raw.split("-");
            const time = { raw: date_string.split(" ")[1].split(":") };

            date.year = Number(date.parsed[0]);
            date.month = Number(date.parsed[1]);
            date.day = Number(date.parsed[2]);

            time.hrs = Number(time.raw[0]);
            time.min = time.raw[1].slice(0, 2);
            time.tod = time.raw[1].slice(-2);

            if (date_string.includes("to")) {
                time.start = { hrs: date_string.slice(11, 13), min: date_string.slice(14, 16) };
                time.start.tod = date_string.slice(16, 19);
                time.end = { hrs: date_string.slice(22, 24), min: date_string.slice(25, 27) };
                time.end.tod = date_string.slice(27, 29);
            }

            return { time, date }
        }

parse.node = (node) => {
                    const value = parse.alphanum(node.textContent);
                    return {
                        root: node, value
                    }
                }


parse.items = (domElement) => {
    const qty = domElement.innerText;
    if (qty.includes("item")) return Number(qty.split(" (")[1].split(" i")[0]);
}

parse.dom = (RESPONSE) => new DOMParser().parseFromString(RESPONSE.responseText, "text/html");

parse.alphanum = (string) => string.replace(/[^a-z0-9_]/gi,'');
parse.title = (string) => string.trim().replaceAll("\n", "_").replaceAll(" ", "_").replace(/[^a-z0-9_]/gi,'').toLowerCase();

parse.link = (domElement) => {
    if (domElement == undefined && domElement.href.includes("http") == true) console.log("error", domElement)

    const link = [...domElement.children].find(child => child.href);
    const alt = [...[...domElement.children].map(child => [...child.children].find(child => child.href))][0];

    if (alt !== undefined) {
        return { root: alt, value: alt.href }
    } else if (link !== undefined) {
        return { root: link, value: link.href }
    }

    if (domElement.textContent.includes("sP") || domElement.textContent.includes("sp") || domElement.textContent.includes("Sp") || domElement.textContent.includes("SP")) {
        return { link: domElement.href, value: domElement.textContent }
    }
}

parse.fTable = () => {
    const table = {};

    if (location.pathname.includes("/wms/view_order")) {
        table.query = [...document.querySelectorAll("table")];
        table.arr = [];

        const tables = {};

        if ((table.query[1]) !== undefined) tables.orderDetails = [...table.query[1].rows].slice(0, 10);
        if ((table.query[3]) !== undefined) tables.picklists = [...table.query[3].rows];
        if ((table.query[4]) !== undefined) tables.items = [...table.query[4].rows];
        if ((table.query[2]) !== undefined) tables.allTotes = [...table.query[2].rows] || "";

        const process = (element) => {
            let tr = {};

            element.map(x => {
                const cell = [...x.cells];
                let title = parse.title(cell[0].textContent);
                let value = cell[1].innerText;

                if (cell.length < 2) {
                    value = cell
                }

                if (title.includes("order_creation") || title.includes("shipment_creation") || title.includes("pull_time") || title.includes("delivery_slot")) {
                    value = parse.dateTime(value);
                }

                if (title.includes("item")) {
                    const totes = cell.map(x => {
                        const node = [...x.childNodes].filter(x => x.textContent.length > 7);

                        const tote = {};
                        tote.spoo = parse.link(node[0]);

                        if (node.length < 3) {
                            tote.tracking = null;
                            tote.itemQty = parse.node(node[1]);
                        } else {
                            tote.tracking = parse.node(node[1]);
                            tote.itemQty = parse.node(node[2]);

                            tote.tracking.value = tote.tracking.root.textContent.split(":")[1].trim();
                        }

                        tote.itemQty.value = tote.itemQty.root.textContent.trim().split(" ")[0];


                        return tote
                    });

                    title = "all";
                    value = totes;

                }

                tr[title] = value;
            })

            return tr
        }

        const orderDetails = process(tables.orderDetails);
        orderDetails.internal_id = parse.alphanum(orderDetails["fulfillment_shipment_id"].split(" ")[orderDetails["fulfillment_shipment_id"].split(" ").length - 1]);
        orderDetails["fulfillment_shipment_id"] = orderDetails["fulfillment_shipment_id"].split(" ")[0];

        const totes = process(tables.allTotes);

        const picklists = { zone: sort(parse.table(tables.picklists), "pick_zone"), status: sort(parse.table(tables.picklists), "status") };

        const items = parse.table(tables.items);
        items.qty = {};
        items.qty.asin = items.length;
        items.qty.total = items.reduce((sum, item) => sum + Number(item.quantity.value), 0);

        return { orderDetails, totes, picklists, items }
    }
};

parse.table = (domTable = []) => {
    const table = {};

    if (typeof domTable === "string") {
        table.query = [ document.querySelector(`#${domTable}`), document.querySelector(`.${domTable}`) ].find(x => x !== null);
        table.rows = [...table.query.rows];
    } else {
        table.rows = [...domTable];
    }

    let count = 0;
    table.headers = [...table.rows.shift().cells].map(x => {
        count++;

        if (x.textContent == "") {
            switch(count) {
                case 6: x.innerText = "View Picklist"; break;
                case 7: x.innerText = "Picklist History"; break;
                case 8: x.innerText = "Pack"; break;
            }
        }
        return parse.title(x.innerText.trim())
    });

    table.columns = table.rows.map(x => [...x.cells]);
    table.parsed = [];

    table.columns.map((column, i) => {
        let picklist = {};
        for(let x = 0; x < table.headers.length; x++) {
            const parsed = {};

            picklist[table.headers[x]] = { root: column[x], value: column[x].innerText };

            parsed.link = parse.link(column[x]);
            if (parsed.link !== undefined) picklist[table.headers[x]].link = parsed.link.value;

            parsed.picklist = parse.items(column[x]);
            if (parsed.picklist !== undefined) picklist[table.headers[x]].qty = parsed.picklist;

            if (table.headers[x] == "order_id") {
                picklist.order_id.internal_id = column[x].innerText.split(" ")[column[x].innerText.split(" ").length - 1];
                picklist.order_id.value = picklist.order_id.value.replaceAll("\n", " ").split(" ")[0];
            }
        }

        table.parsed.push(picklist)
    })

    return table.parsed
};

const get = (URL, FUNCTION) => {
    GM_xmlhttpRequest({
        method: "GET",
        url: URL,
        onload: async (response) => {
            const PARSED_HTML = parse.dom(response);
            const DOCUMENT = ROOT_DOCUMENT.querySelector(ROOT_QUERY);

            () => FUNCTION
        }
    });
}

const update = {};

update.html = (URL, ROOT_DOCUMENT, ROOT_QUERY, PARSE_QUERY = "") => {
    GM_xmlhttpRequest({
        method: "GET",
        url: URL,
        onload: async (response) => {
            const PARSED_HTML = parse.dom(response);
            const DOCUMENT = ROOT_DOCUMENT.querySelector(ROOT_QUERY);

            if (PARSE_QUERY == "") PARSE_QUERY = ROOT_QUERY;

            DOCUMENT.innerHTML = PARSED_HTML.querySelector(PARSE_QUERY).innerHTML
        }
    });
}

update.text = (URL, ROOT_DOCUMENT, ROOT_QUERY, PARSE_QUERY = "") => {
    GM_xmlhttpRequest({
        method: "GET",
        url: URL,
        onload: async (response) => {
            const PARSED_HTML = parse.dom(response);
            const DOCUMENT = ROOT_DOCUMENT.querySelector(ROOT_QUERY);

            if (PARSE_QUERY == "") PARSE_QUERY = ROOT_QUERY;

            DOCUMENT.innerText = PARSED_HTML.querySelector(PARSE_QUERY).innerText
        }
    });
}

const sortP = (array, key, query) => array.filter(x => x[key].value == query);


const sorta = (dataarray, key) => {
    const sortBy = [... new Set(dataarray.map(x => x[key].value))];

    let group = [];

    sortBy.map(x => {
        const build = {};
        build.param = parse.title(x.toLowerCase());
        build.arrs = [];
        dataarray.map(y => {
            if (x == y[key].value) build.arrs.push(y);

        });
        group.push(build)
    })

    return { root: dataarray, sort: group }
}

const sort = (dataArray, key) => {
    const sortBy = [... new Set(dataArray.map(x => x[key].value))];

    let group = [];

    sortBy.map(picker => {
        const build = {};
        build.param = parse.title(picker.toLowerCase());
        build.picks = [];
        dataArray.map(pick => {
            if (picker == pick[key].value) build.picks.push(pick);

        });
        group.push(build)
    })

    return { root: dataArray, sort: group }
}

const print = {};
print.chime = (MSG, URL) => {
    //const URL = "";
    GM_xmlhttpRequest({
        method: "POST",
        url: URL,
        data: `{"Content":"${MSG}"}`,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            //console.log(response.responseText);
        }
    });
}

const routine = (UPDATE_INTERVAL, FUNCTION) => {
    setInterval(() => FUNCTION(), UPDATE_INTERVAL)
}

if (location.hostname.includes("aftlite")) {
    const AUTH_TOKEN = document.querySelector("meta[name=csrf-token]").content;
    const LOGGED_USER = document.querySelector(".wms-welcome") && document.querySelector(".wms-welcome").innerText.split("(")[1].split(")")[0].toUpperCase().trim();

    let FC = document.title.split("]")[0].split("[")[1] || document.querySelector(".wms-name").innerText;
    FC = FC.trim();

    !(location.pathname.includes("/login")) && localStorage.setItem("logged_user", LOGGED_USER);
    
    sessionStorage.setItem("AUTH_TOKEN", AUTH_TOKEN);
    sessionStorage.setItem("LOGGED_USER", LOGGED_USER);
    sessionStorage.setItem("FC", FC);
    
}

// REQUEST URLS
const uphDrilldown = (AUTH_TOKEN, START_MONTH, START_DAY, START_YEAR, START_HOUR, END_MONTH, END_DAY, END_YEAR, END_HOUR, FUNCTION, ZONE = "--") => {
    return `https://aftlite-na.amazon.com/labor_tracking/uph_drilldown?authenticity_token=${AUTH_TOKEN}&date[start_month]=${START_MONTH}&date[start_day]=${START_DAY}&date[start_year]=${START_YEAR}&date[start_hour]=${START_HOUR}&date[end_month]=${END_MONTH}&date[end_day]=${END_DAY}&date[end_year]=${END_YEAR}&date[end_hour]=${END_HOUR}&function=${FUNCTION}&zone=${ZONE}`;
}

const req = {};
req.uphDrilldown = uphDrilldown();

