if (!window.location.href.includes("dash")) {
	// SHORTCUTS
	document.onkeyup = function (e) {
		if (e.shiftKey && e.which == 85) {
			getActiveJobSummary();
			console.log(localStorage.length);
		}
	};
}
/*
    setInterval(() => {
        let tasks = document.querySelector(`h1[data-dtk-test-id="job-grid-title"]`);
        let jobCard = [...document.querySelectorAll(`div.row.job-card.no-margin`)];

        let routes = jobCard.map((rte) => {
            let routes = [...rte.children];

            let route = {};
            route.id = { root: routes[0] };
            route.id.value = route.id.root.innerText;
            route.destination = { root: routes[1] };
            route.destination.value = route.destination.root.innerText;
            route[`cart/s`] = { root: routes[2] };
            route[`cart/s`].value = route[`cart/s`].root.innerText;
            route.batcher = { root: routes[3] };
            route.batcher.value = route.batcher.root.innerText;
            route.ppst = { root: routes[4] };
            route.ppst.value = route.ppst.root.innerText;
            route.progress = { root: routes[5] };
            route.progress.value = route.progress.root.innerText;

            return route
        });

        let batchers = routes.filter((route) => route.batcher.value != "ASSIGNABLE");


        tasks.innerHTML = tasks.innerText ? `${tasks.innerText} Batchers: ${batchers.length}` : tasks.innerText


        console.log("tasking");
    }, 200000)
*/

setTimeout(() => {
	let tasks = document.querySelector("div.container-fluid.job-cards");

	tasks.addEventListener("change", () => console.log("changing"));
}, 2000);

const getActiveJobSummary = () => {
	const url =
		"https://como-operations-dashboard-iad.iad.proxy.amazon.com/api/store/f170be3c-eda4-43dd-b6bd-2325b4d3c719/activeJobSummary";
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.responseType = "json";
	xhr.onload = () => {
		if (xhr.status !== 200) {
			console.log(`Error ${xhr.status}: ${xhr.statusText}`);
		} else {
			const routes = xhr.response;

			routes.map((route) => {
				getRoute(route.jobId);
			});
		}
	};
	xhr.onerror = () =>
		console.log(
			"There was a network error. Check your internet connection and try again."
		);
	xhr.send();
};

const getRoute = (id) => {
	const url = `https://como-operations-dashboard-iad.iad.proxy.amazon.com/api/store/f170be3c-eda4-43dd-b6bd-2325b4d3c719/job/${id}`;
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.responseType = "json";
	xhr.onload = () => {
		if (xhr.status !== 200) {
			console.log(`Error ${xhr.status}: ${xhr.statusText}`);
		} else {
			const route = xhr.response;

			route.packageDetails.map((pkg) => {
				/*
                    let pack = {};
                    pack.tracking = pkg.scannableId;
                    pack.orderId = pkg.orderId;
                    pack.batchId = pkg.lastKnownBatchId;
                    pack.lastStaged = pkg.handoffLocation;
                    pack.stowedDate = pkg.stowedDate;
                    pack.lastModified = pkg.handoffLocation;
                    pack.active = pkg.active;
                    pack.status = pkg.status;
                    */
				if (!localStorage[`${pkg.scannableId}`] && pkg.handoffLocation) {
					localStorage[`${pkg.scannableId}`] = JSON.stringify(pkg);
				}
				//localStorage[`${pkg.scannableId}`] = JSON.stringify(pkg);
			});
		}
	};
	xhr.onerror = () =>
		console.log(
			"There was a network error. Check your internet connection and try again."
		);
	xhr.send();
};

setInterval(() => {
	getActiveJobSummary();
	console.log(localStorage.length);
}, 6000);
