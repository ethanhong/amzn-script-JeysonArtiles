// ==UserScript==
// @name         COMO - FETCH ROUTES
// @namespace    https://github.com/JeysonArtiles/amzn
// @version      0.3
// @description  Get Routes
// @author       jeyartil
// @match        https://como-operations-dashboard-iad.iad.proxy.amazon.com/store/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/fetchRoutes_como.user.js
// @updateURL  	 https://raw.githubusercontent.com/JeysonArtiles/amzn/master/fetchRoutes_como.user.js
// ==/UserScript==

(function () {
    "use strict";

    const REPLACE_WITH_YOUR_STORE_ID = "f170be3c-eda4-43dd-b6bd-2325b4d3c719";
    // ------ ENTER YOUR STORE ID ABOVE ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^;

    const STORE_ID = window.location.href.split("store/")[1].split("/")[0] || REPLACE_WITH_YOUR_STORE_ID;

    const fetchAllPackages = async (STORE_ID) => {
        const response = await fetch(`https://como-operations-dashboard-iad.iad.proxy.amazon.com/api/store/${STORE_ID}/packages`);
        const data = await response.json();

        const packages = {};
        packages.active = { all: data.filter( ({active}) => active == true) };
        packages.staged = { all: data.filter( ({status}) => status == "STOWED") };
        //packages.staged.bin = { all: packages.staged.all.filter( ({location}) => !location.includes("CART")) };
        packages.collected = { all: data.filter( ({status}) => status == "COLLECTED") };
        packages.notStaged = { all: data.filter( ({status}) => status !== "STOWED" && status !== "COLLECTED") };

        const allPackages = [packages.active, packages.staged, packages.collected, packages.notStaged];

        const sortByZone = (PACKAGES_OBJ) => {
            const zones = {};
            zones.ambient = PACKAGES_OBJ.all.filter( ({temperatureZone}) => temperatureZone == "AMBIENT");
            zones.chiller = PACKAGES_OBJ.all.filter( ({temperatureZone}) => temperatureZone == "COLD");
            zones.freezer = PACKAGES_OBJ.all.filter( ({temperatureZone}) => temperatureZone == "FROZEN");

            return zones;
        }

        allPackages.map((PACKAGES) => {
            PACKAGES.byZone = sortByZone(PACKAGES);
        })

        //console.log(packages)

        return packages
    }

    const fetchActiveJobSummary = async (STORE_ID) => {
        const ALL_ACTIVE_PACKAGES = await (await fetchAllPackages(STORE_ID)).active;

        const response = await fetch(
            `https://como-operations-dashboard-iad.iad.proxy.amazon.com/api/store/${STORE_ID}/activeJobSummary`
        );
        const data = await response.json();
            console.log(ALL_ACTIVE_PACKAGES)

        const fetchPackagesFromRoute = async (JOB_ID) => {
            const response = await fetch(
                `https://como-operations-dashboard-iad.iad.proxy.amazon.com/api/store/${STORE_ID}/job/${JOB_ID}`
        );
            const data = await response.json();


            const activePackagesCurrentWindow = data.filter(({packageDetails: { scannableId }}) => scannableId)

            data.packageDetails.map((pkg) => {

                //if (!sessionStorage[`${pkg.scannableId}`] && pkg.handoffLocation) sessionStorage[`${pkg.scannableId}`] = JSON.stringify(pkg);
            });

        }

        data.map((route) => {
            fetchPackagesFromRoute(route.jobId);
        });
    };

    fetchActiveJobSummary(STORE_ID);

    setInterval(() => {
        fetchAllPackages(STORE_ID);
        //getActiveJobSummary();
        console.log(sessionStorage.length);
    }, 600000);
})();
