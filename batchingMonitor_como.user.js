// ==UserScript==
// @name         [ BATCHING MONITOR ] COMO
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  MONITOR BATCHERS. SET RECOMMENDED BATCHERS. SET TASKS PER BATCHER.
// @author       You
// @match        https://como-operations-dashboard-iad.iad.proxy.amazon.com/store/*/dash
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/batchingMonitor_como.user.js
// @updateURL    https://raw.githubusercontent.com/JeysonArtiles/amzn/master/batchingMonitor_como.user.js
// @icon         https://www.google.com/s2/favicons?domain=amazon.com-update-test
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    sessionStorage.tasksPerBatcher = 4

    document.onkeyup = function (e) {
        if (e.shiftKey && e.which == 66) {
            const tasksPerBatcher = prompt("Enter desired tasks per batcher:", 4);
            setTasksPerBatcher(tasksPerBatcher);
        }
    };

    const setTasksPerBatcher = (number) => { sessionStorage.tasksPerBatcher = number; };

    setTimeout(() => {
        updateTasks();
    }, 500);

    const fetchData = async () => {
        const response = await fetch(
            "https://como-operations-dashboard-iad.iad.proxy.amazon.com/api/store/f170be3c-eda4-43dd-b6bd-2325b4d3c719/activeJobSummary"
        );

        const data = await response.json();
        const tasks = {};
        tasks.total = data.length;
        tasks.complete = data.filter(route => route.operationState == "COMPLETED").length;
        tasks.inProgress = data.filter(route => route.operationState == "IN_PROGRESS").length;
        tasks.current = data.filter(route => route.operationState == "NONE" || route.operationState == "IN_PROGRESS").length;

        sessionStorage.tasks = JSON.stringify(tasks);
    }

    setInterval(() => { fetchData(); updateTasks(sessionStorage.tasks); }, 1500);
    let debugUpdating = 0;

    const updateTasks = (task) => {
        const tasks = JSON.parse(task);

        const DOM = {};
        DOM.tasks = document.querySelector("h1[data-dtk-test-id='job-grid-title']");
        let recommendedBatchers = (tasks.total / sessionStorage.tasksPerBatcher).toFixed(1);

        if(tasks.total > tasks.current) recommendedBatchers = (tasks.current / sessionStorage.tasksPerBatcher).toFixed(1);
        if(tasks.current < 10) recommendedBatchers = 3;


        debugUpdating++;
        DOM.tasks.innerHTML = `Tasks (${tasks.current})
            <span id="recommendedBatchers" style="margin-left: 1em">BATCHERS:
            <span id="batchers">${tasks.inProgress} / ${recommendedBatchers}</span></span>
            <span id="action"></span> <span style="margin: 1em" hidden>Update Debugger: ${debugUpdating}</span>`;

        DOM.recommendedBatchers = document.querySelector('#recommendedBatchers');
        DOM.batchers = document.querySelector('#batchers');

        DOM.action = document.querySelector('#action');

        /*

        NTS: ADJUST DURING BATCHING

        if( (tasks.inProgress % recommendedBatchers) > 3 && tasks.inProgress !== 0) {
            DOM.recommendedBatchers.style.color = "red";
            DOM.recommendedBatchers.style.fontWeight = "bold";

            DOM.batchers.style.fontWeight = "bold";

            //DOM.action.innerText = "(UPSTAFF)";
            DOM.action.style.color = "red";
            DOM.action.style.fontWeight = "bold";

            //console.log("upstaff")
        }

        if((recommendedBatchers - tasks.inProgress) > 2 && tasks.inProgress !== 0) {
            DOM.recommendedBatchers.style.color = "red";
            DOM.recommendedBatchers.style.fontWeight = "bold";

            DOM.batchers.style.fontWeight = "bold";

            //DOM.action.innerText = "(DOWNSTAFF)";
            DOM.action.style.color = "red";
            DOM.action.style.fontWeight = "bold";

            //console.log("downstaff")
        }


        */

        if(tasks.inProgress == 0) DOM.recommendedBatchers.style.visibility = "hidden";
    }

    })();
