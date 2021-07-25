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
	let packages = [...document.querySelectorAll("tr[ng-repeat='pkg in ctrl.packages']")];

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

		cells.temp = temp && console.log(root);

		cells.lastKnownLocation.innerHTML =
			lastKnownLocation && lastKnownLocation !== cells.lastKnownLocation.innerText
				? `${cells.lastKnownLocation.innerText} <span style="background-color:#555555; color: white; padding: 5px; font-weight: bold; text-align: center; min-width: 175px; display: inline-block">${lastKnownLocation}</span>`
				: cells.lastKnownLocation.innerHTML;

		console.log(JSON.parse(localStorage["U8TR5AA2YGHAN6BB9PH2"]));
	});
};

setTimeout(() => getPackageDetails(), 1500);
