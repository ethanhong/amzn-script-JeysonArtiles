// ==UserScript==
// @name         [ FIND BAGS ] COMO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://como-operations-dashboard-iad.iad.proxy.amazon.com/store/f170be3c-eda4-43dd-b6bd-2325b4d3c719/labor*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function (e) {
        if (e.shiftKey && e.which == 70) {
            const knownBags = JSON.parse(prompt("COPY FROM AFTLITE"));
            console.log(knownBags)
            showStagedBags(knownBags);
        }
    };

    const showStagedBags = async ({ missingBag: { tracking }, knownBags: { foundBags }}) => {
        const allPackages = await comoPackages();

        const stagedBags = allPackages.filter(({scannableId}) => {
            const match = foundBags.filter(trackingNumber => trackingNumber == scannableId);
            return match == scannableId
        })

        const missingBagTrackingNumber = tracking.slice(0, -4);
        const missingBagLastFour = tracking.substr(tracking.length - 4);

        const footerRoot = document.querySelector("footer");
        footerRoot.innerHTML = `<h3 style="text-align: center; font-weight: bold;">CONFIRM STAGE SLA IS <span style="color: red; font-weight: 900;">RED</span> & BAGS NOT IN PROBLEM-SOLVE / WITH PICKER / ETC.</h3>
        <h1 style="text-align: center">Check near these bins for missing bag: ${missingBagTrackingNumber}<span style="font-weight: 999; padding: 5px;">${missingBagLastFour}</span></h1>
        <div id="stagedLocations"></div>`;

        const footer = document.querySelector("#stagedLocations")

        let footerHTML = "";
        const stagedLocations = stagedBags.map(({ scannableId, lastKnownLocation, locationId, temperatureZone }) => {
            if(!(/CART|ZONE/.test(lastKnownLocation))) {
                console.log(scannableId)
                if(scannableId == tracking) footerHTML = footerHTML.concat(`<span style="font-size: 25px; background-color: #0bda51; color: white; padding: 5px; font-weight: bold; text-align: center; min-width: 650px; display: inline-block; margin: 10px;">${scannableId} : ${lastKnownLocation}</span> &nbsp;`);
                footerHTML = footerHTML.concat(`<span style="font-size: 25px; background-color: black; color: white; padding: 5px; font-weight: bold; text-align: center; min-width: 650px; display: inline-block; margin: 10px;">${scannableId} : ${lastKnownLocation}</span> &nbsp;`);
            }
        })

        footer.innerHTML = footerHTML;
        footer.style.textAlign = 'center';

        if (!footer.innerText.includes("_")) footer.innerHTML = "<h1>NO BAGS COULD BE FOUND</1>";
    }

    const comoPackages = async () => {
        const response = await fetch(
            "https://como-operations-dashboard-iad.iad.proxy.amazon.com/api/store/f170be3c-eda4-43dd-b6bd-2325b4d3c719/packages"
        );
        const data = await response.json();
        let pkgs = [];

        data.map((pkg) => {
            const route = {};
            pkgs.push(pkg);
        });

        return pkgs;
    };

    comoPackages();


    const comoMissingBags = async () => {
        const response = await fetch(
            "https://como-operations-dashboard-iad.iad.proxy.amazon.com/api/store/f170be3c-eda4-43dd-b6bd-2325b4d3c719/handoffTasks"
        );

        const { tasks } = await response.json();

        const missingBags = [];
        const missingScannableIds = [];

        tasks.map(({ identifier, packages, tempZone }) => {
            const missingBag = {};
            missingBag.identifier = identifier;
            missingBag.zone = tempZone;

            let pkgs = packages.map(({lastKnownLocation, locationClass, locationId, orderId, scannableId, status, temperatureZone}) => {
                const pkg = { lastKnownLocation, locationClass, locationId, orderId, _scannableId: scannableId, status, temperatureZone };
                missingScannableIds.push(scannableId);

                return pkg;
            })

            missingBag.pkgs = pkgs;
            missingBags.push(missingBag);
        });

        return missingScannableIds;
    };



})();
