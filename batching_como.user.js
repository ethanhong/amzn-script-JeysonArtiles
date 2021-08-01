// ==UserScript==
// @name         [ BATCHING MONITOR ] COMO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://como-operations-dashboard-iad.iad.proxy.amazon.com/store/f170be3c-eda4-43dd-b6bd-2325b4d3c719/dash
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/batching_como.user.js
// @updateURL     https://raw.githubusercontent.com/JeysonArtiles/amzn/master/batching_como.user.js
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function (e) {
        if (e.shiftKey && e.which == 66) {
            const tasksPerBatcher = prompt("Enter desired tasks per batcher:", 4);
            setTasksPerBatcher(tasksPerBatcher);
        }
    };

    const setTasksPerBatcher = (number) => { localStorage.tasksPerBatcher = number; };

    setTimeout(() => {
        updateTasks();
        localStorage.tasksPerBatcher = 4
    }, 1000);

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

        localStorage.tasks = JSON.stringify(tasks);
    }

    setInterval(() => { fetchData(); updateTasks(localStorage.tasks); }, 1500);
    let debugUpdating = 0;

    const updateTasks = (task) => {
        const tasks = JSON.parse(task);

        const DOM = {};
        DOM.tasks = document.querySelector("h1[data-dtk-test-id='job-grid-title']");
        const recommendedBatchers = Math.ceil(tasks.total / localStorage.tasksPerBatcher);

        debugUpdating++;
        DOM.tasks.innerHTML = `Tasks (${tasks.current})
            <span id="recommendedBatchers" style="margin-left: 1em">Recommended Batchers:
            <span id="batchers">${tasks.inProgress} / ${recommendedBatchers}</span></span>
            <span id="action"></span> <span style="margin: 1em" hidden>Update Debugger: ${debugUpdating}</span>`;

        DOM.recommendedBatchers = document.querySelector('#recommendedBatchers');
        DOM.batchers = document.querySelector('#batchers');

        DOM.action = document.querySelector('#action');

        if(tasks.inProgress < (recommendedBatchers * .70)) {
            DOM.batchers.style.color = "red";
            DOM.batchers.style.fontWeight = "bold";

            //DOM.action.innerText = "(UPSTAFF)";
            DOM.action.style.color = "red";
            DOM.action.style.fontWeight = "bold";

            //console.log("upstaff")
        }

        if(tasks.inProgress > recommendedBatchers) {
            DOM.batchers.style.color = "red";
            DOM.batchers.style.fontWeight = "bold";

            //DOM.action.innerText = "(DOWNSTAFF)";
            DOM.action.style.color = "red";
            DOM.action.style.fontWeight = "bold";

            //console.log("downstaff")
        }

        //console.log("checking")

        //console.log(DOM.tasks.innerText.replace(/\D/g,''))
    }

    })();
