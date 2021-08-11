// ==UserScript==
// @name         COMO - Get Routes
// @namespace    mailto:jeyartil@amazon.com
// @version      0.9
// @description  Get Routes
// @author       jeyartil
// @match        https://como-operations-dashboard-iad.iad.proxy.amazon.com/store/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/como_dash.user.js
// @updateURL  	 https://raw.githubusercontent.com/JeysonArtiles/amzn/master/como_dash.user.js
// ==/UserScript==

// EXAMPLE (COMO LINK): https://como-operations-dashboard-iad.iad.proxy.amazon.com/store/f170be3c-eda4-43dd-b6bd-2325b4d3c719/dash
// STORE ID = f170be3c-eda4-43dd-b6bd-2325b4d3c719

const STORE_ID_BACKUP = "f170be3c-eda4-43dd-b6bd-2325b4d3c719";
const STORE_ID = window.location.href.split("store/")[1].split("/")[0] || STORE_ID_BACKUP;

const fetchAllPackages = async (STORE_ID) => {
    const response = await fetch(`https://como-operations-dashboard-iad.iad.proxy.amazon.com/api/store/${STORE_ID}/packages`);
    const data = await response.json();

    const packages = {};
    packages.active = data.filter( ({active}) => active == true);
    packages.staged = data.filter( ({status}) => status == "STAGING_WALL");
    packages.collected = data.filter( ({status}) => status == "COLLECTED");
    packages.notStaged = data.filter( ({status, active, missing}) => status !== "STOWED" && status !== "COLLECTED" && status !== "DROPPING" && active == true);

    const allPackages = [packages.active, packages.staged, packages.collected, packages.notStaged];

    const sortByZone = (PACKAGES_OBJ) => {
        const zones = {};
        zones.ambient = PACKAGES_OBJ.filter( ({temperatureZone}) => temperatureZone == "AMBIENT");
        zones.chiller = PACKAGES_OBJ.filter( ({temperatureZone}) => temperatureZone == "COLD");
        zones.freezer = PACKAGES_OBJ.filter( ({temperatureZone}) => temperatureZone == "FROZEN");

        return zones;
    }

    allPackages.map((PACKAGES) => {
        PACKAGES.byZone = sortByZone(PACKAGES);
    })

    const storePackages = [];
    packages.active.map(PACKAGE => {
        const pkg = {};
        pkg[PACKAGE.scannableId] = PACKAGE;

        //storePackages.push(JSON.stringify(pkg));
        storePackages.push(PACKAGE);
    });

    const storePackgesHandoff = storePackages.map(packages => {
        if(packages.locationId.includes("CART")) packages.handoffLocation = "NOT STAGED"

        if (!packages.handoffLocation) {
            packages.handoffLocation = packages.locationId
            return packages
        }
    })

    sessionStorage.packages = JSON.stringify(storePackgesHandoff);

    //console.log(storePackages.length)

    return packages
}

const batchingTasks = async (STORE_ID) => {
    const ALL_PACKAGES = await fetchAllPackages(STORE_ID);
    const ALL_ACTIVE_PACKAGES = await (await fetchAllPackages(STORE_ID)).active;

    const response = await fetch(
        `https://como-operations-dashboard-iad.iad.proxy.amazon.com/api/store/${STORE_ID}/activeJobSummary`
        );
    const data = await response.json();

    const routes = {};
    routes.all = data;


    const activeRoutes = routes.all.map(route => {
        return route.batchingTime
    })

    routes.assignable = routes.all.filter(({taskState, associateId}) => taskState == "ASSIGNABLE" && associateId == null);
    routes.complete = routes.all.filter(({taskState}) => taskState == "COMPLETE");
    routes.inProgress = routes.all.filter(({operationState}) => operationState == "IN_PROGRESS");
    routes.partial = routes.all.filter(({operationState, fulfillmentComplete}) => operationState == "COMPLETED" && fulfillmentComplete == false);
    routes.split = routes.all.filter(({tasksStateReason, fulfillmentComplete, taskState}) => tasksStateReason == "REBATCH_READY_FOR_PICKUP");
    routes.psolve = routes.all.filter(({state}) => state == "SIDELINED");
    routes.reverseStage = routes.all.filter(({destination}) => destination == "UNPACK");

    const fetchPackagesFromRoute = async (JOB_ID) => {
        const response = await fetch(
            `https://como-operations-dashboard-iad.iad.proxy.amazon.com/api/store/${STORE_ID}/job/${JOB_ID}`
        );
            const routes = await response.json();

            const packagesInRoute = [];
            routes.packageDetails.map((pkg) => {
                packagesInRoute.push(pkg);
            });

            return packagesInRoute
        }

        const packagesFromRoute = await Promise.all(
            routes.all.map(async (route) => fetchPackagesFromRoute(route.jobId))
        )

        sessionStorage.allRoutes = JSON.stringify(routes)

        sessionStorage.activeTasks = JSON.stringify(packagesFromRoute);
};


setInterval(() => {
    batchingTasks(STORE_ID);

    //console.log(JSON.parse(sessionStorage.packages));
}, 6000);
