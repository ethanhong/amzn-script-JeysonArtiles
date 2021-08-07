// ==UserScript==
// @name         COMO - Show Routes
// @namespace    mailto:jeyartil@amazon.com
// @version      0.7
// @description  Show Routes
// @author       jeyartil
// @match        https://como-operations-dashboard-iad.iad.proxy.amazon.com/store/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/como_route.user.js
// @updateURL  	 https://raw.githubusercontent.com/JeysonArtiles/amzn/master/como_route.user.js
// ==/UserScript==

(function(history){
    var pushState = history.pushState;
    history.pushState = function(state) {
        setTimeout(() => getPackageDetails(), 1203);
        return pushState.apply(history, arguments);
    };
})(window.history);

if (window.location.href.includes("labor")) {
    // SHORTCUTS
    document.onkeyup = function (e) {
        if (e.shiftKey && e.which == 84) {
            checkPackage();
            console.log("job");
        }
    };
}

const getPackageDetails = () => {
    let packages = [
        ...document.querySelectorAll("tr[ng-repeat='pkg in ctrl.packages']")
    ];

    //console.log(packages)

    const activeTasks = JSON.parse(sessionStorage.activeTasks);

    const lastKnownLocationSpan = (lastKnownLocation) => `<span style="background-color:#555555; color: white; padding: 5px; font-weight: bold; text-align: center; min-width: 175px; display: inline-block">${lastKnownLocation}</span>`;

    const matchedPackagesinnerHTML = [];

    packages.map((pkg) => {
        let cells = {};
        cells.number = pkg.cells[1];
        cells.status = pkg.cells[2];
        cells.scannableId = pkg.cells[3];
        cells.temp = pkg.cells[4];
        cells.lastKnownLocation = pkg.cells[5];
        cells.lastModifiedTime = pkg.cells[6];
        cells.order = pkg.cells[7];

        activeTasks.map(ssp => {
            ssp.map((packages) => {
                if (cells.scannableId.innerText == packages.scannableId) {
                    //console.log(cells.lastKnownLocation, packages.handoffLocation)
                    cells.lastKnownLocation.innerHTML = cells.lastKnownLocation.innerText !== packages.handoffLocation ? `${cells.lastKnownLocation.innerText} ${lastKnownLocationSpan(packages.handoffLocation)}`
					 : cells.lastKnownLocation.innerHTML;
                }
            })
        })
    });
};

setTimeout(() => getPackageDetails(), 1500);
//setTimeout(() => getPackageDetails(), 2000);

const checkPackage = () => {
    let pkg = prompt("Enter tracking code");
    const findPackages = JSON.parse(sessionStorage.packages);

    findPackages.map(package => {
        if (package.scannaleId == "XKNQTKLKHN8XUCHXDUNB") console.log(package)
    })

    //console.log(foundPackage)

    //const result = findPackages.map(packages => packages.find(package => package.scannableId == pkg));

    //console.log(result)

};
