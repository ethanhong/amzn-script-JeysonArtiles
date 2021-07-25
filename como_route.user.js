// ==UserScript==
// @name         COMO - Show Routes
// @namespace    mailto:jeyartil@amazon.com
// @version      0.4
// @description  Show Routes
// @author       jeyartil
// @match        https://como-operations-dashboard-iad.iad.proxy.amazon.com/store/f170be3c-eda4-43dd-b6bd-2325b4d3c719/jobdetails?jobId=*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/como_route.user.js
// @updateURL  	 https://raw.githubusercontent.com/JeysonArtiles/amzn/master/como_route.user.js
// ==/UserScript==

(function () {
	"use strict";

	localStorage.toggle = false;

	if (window.location.href.includes("jobId") && localStorage.toggle == false) {
		// SHORTCUTS
		document.onkeyup = function (e) {
			if (e.which == 85) {
				alert("boo");
				//getPackageDetails();
			}
		};
	}

	const getPackageDetails = () => {
		localStorage.toggle = true;
		let packages = [
			...document.querySelectorAll("tr[ng-repeat='pkg in ctrl.packages']"),
		];

		packages.map((pkg) => {
			let cells = {};
			cells.number = pkg.cells[1];
			cells.status = pkg.cells[2];
			cells.scannableId = pkg.cells[3];
			cells.temp = pkg.cells[4];
			cells.lastKnownLocation = pkg.cells[5];
			cells.lastModifiedTime = pkg.cells[6];
			cells.order = pkg.cells[7];

			let root = JSON.parse(localStorage[`${cells.scannableId.innerText}`]);
			let lastKnownLocation = root.handoffLocation;
			let notStaged = root.locationId;
			let staged = root.lastKnownLocation;
			let temp = root.temperatureZone;

			switch (temp) {
			}

			cells.temp;

			cells.lastKnownLocation.innerHTML =
				lastKnownLocation && lastKnownLocation !== cells.lastKnownLocation.innerText
					? `${cells.lastKnownLocation.innerText} <span style="background-color:#555555; color: white; padding: 5px; font-weight: bold; text-align: center; min-width: 175px; display: inline-block">${lastKnownLocation}</span>`
					: cells.lastKnownLocation.innerHTML;

			//console.log(JSON.parse(localStorage[""]));
		});
	};

	setTimeout(() => getPackageDetails(), 1500);
})();
