const parse = {};
parse.link = (domElement) => {
    const a = [...domElement.children].find(child => child.href);

    if (a !== undefined) return { root: a, value: a.href }
}

parse.items = (domElement) => {
    const qty = domElement.innerText;
    if (qty.includes("item")) return Number(qty.split(" (")[1].split(" i")[0]);
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
