const ifp = (pathname, func) => {
    if (location.pathname.includes(pathname)) () => func;
}

const parse = { table: {} };

parse.link = (domElement) => {
    const a = [...domElement.children].find(child => child.href);

    if (a !== undefined) return { root: a, value: a.href }
}

parse.items = (domElement) => {
    const qty = domElement.innerText;
    if (qty.includes("item")) return Number(qty.split(" (")[1].split(" i")[0]);
}

parse.dom = (RESPONSE) => new DOMParser().parseFromString(RESPONSE.responseText, "text/html");

parse.html = (URL, ROOT_DOCUMENT, QUERY) => {
    GM_xmlhttpRequest({
        method: "GET",
        url: URL,
        onload: async (response) => {
            const PARSED_HTML = parsed.dom(response);
            const DOCUMENT = ROOT_DOCUMENT.querySelector(QUERY);
            
            DOCUMENT.innerHTML = PARSED_HTML.querySelector(QUERY).innerHTML;
        }
    });
}

parse.table = (domTable) => {
    const table = {};
    table.query = [ document.querySelector(`#${domTable}`), document.querySelector(`.${domTable}`) ].find(x => x !== null);
    table.rows = [...table.query.rows];
    table.headers = [...table.rows.shift().cells].map(x => x.innerText.trim().replace("\n", "_").replace(" ", "_").toLowerCase());
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

        }

        table.parsed.push(picklist)
    })

    return table.parsed
};

const sort = (dataArray, key) => {
    const sortBy = [... new Set(dataArray.map(x => x[key].value))];

    let group = [];

    sortBy.map(picker => {
        const build = {};
        build.param = picker;
        build.picks = [];
        dataArray.map(pick => {
            if (picker == pick[key].value) build.picks.push(pick);

        });
        group.push(build)
    })

    return group
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

