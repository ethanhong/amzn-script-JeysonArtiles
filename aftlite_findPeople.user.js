// ==UserScript==
// @name         Find People
// @namespace    mailto:jeyartil@amazon.com
// @version      0.2
// @description  Live Rate Indicator
// @author       jeyartil
// @match        https://aftlite-na.amazon.com/labor_tracking/find_people
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/aftlite_findPeople.user.js
// @updateURL  	 https://raw.githubusercontent.com/JeysonArtiles/amzn/master/aftlite_findPeople.user.js
// ==/UserScript==

(function () {
	"use strict";

	const convert_seconds = (min, sec) => {
		return Number(min) * 60 + Number(sec);
	};

	const update_interval = (seconds) => seconds * 1000;
	const update_seconds = update_interval(5);

	const checkRate = () => {
		const url = window.location.href;
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.responseType = "html";
		xhr.onload = () => {
			if (xhr.status !== 200) {
				console.log(`Error ${xhr.status}: ${xhr.statusText}`);
			} else {
				const doc = new DOMParser().parseFromString(xhr.response, "text/html");
				console.log("success");
				//console.log(xhr.response)

				const table = doc.getElementById("recent_event_table");
				let people = [...doc.getElementsByTagName("tr")];
				people.splice(0, 2);

				const people_html = [];
				const get_people = () => {
					const person = [];
					for (let i = 0; i < people.length; i++) {
						let aa = {};
						aa.name = people[i].cells[2].innerText.trim();
						aa.location = { bin: people[i].cells[4].innerText.trim() };

						switch (aa.location.bin.slice(4, 5)) {
							case "F":
								aa.location.zone = "FROZEN";
								break;
							case "C":
								aa.location.zone = "CHILLER";
								break;
							case "B":
								aa.location.zone = "BIGS";
								break;
							case "A":
								aa.location.zone = "AMBIENT";
								break;

							default:
								aa.location.zone = "";
								break;
						}

						aa.time = {};
						aa.time.of = { full: people[i].cells[6].innerText.trim() };
						aa.time.of.hrs = aa.time.of.full.split(":")[0];
						aa.time.of.min = aa.time.of.full.split(":")[1];
						aa.time.of.sec = aa.time.of.full.split(":")[2];
						aa.time.since = { full: people[i].cells[5].innerText.trim() };
						aa.time.since.min = aa.time.since.full.split(" ")[0];
						aa.time.since.sec = aa.time.since.full.split(" ")[2];

						aa.action = {};
						const raw = people[i].cells[7].innerText.trim();

						aa.action.path = raw.includes("/")
							? people[i].cells[7].innerText.split("/")[0].trim().toLocaleLowerCase()
							: raw;
						aa.action.role = raw.includes("/")
							? people[i].cells[7].innerText.split("/")[1].trim().toLocaleLowerCase()
							: aa.action.path || raw;

						const notes = people[i].cells[8].innerText.trim();

						aa.tote = {};
						aa.tote.item = notes.includes("/") ? notes.split("/")[0] : "";
						aa.tote.spoo = notes.includes("/") ? notes.split("/")[1] : "";

						let cell = {};
						cell.root = people[i].cells;
						cell.msg = cell.root[0];
						cell.eos = cell.root[1];
						cell.person = cell.root[2];
						cell.location = cell.root[4];
						cell.time_since = cell.root[5];
						cell.time_of = cell.root[6];
						cell.action = cell.root[7];
						cell.notes = cell.root[8];

						//console.log(cell.root)

						people_html.push(cell);

						aa.cell = JSON.stringify(cell);

						person.push(aa);
					}

					return person;
				};

				const get_people_action = (action) => {
					let people = get_people();

					switch (action) {
						case "pack":
							return people.filter((person) => person.action.role == "pack");
					}
				};

				const update = () => {
					localStorage["60"] = localStorage["40"];
					localStorage["40"] = localStorage["20"];
					// localStorage["20"] = `reload ${localStorage.reload}`;
					localStorage["20"] = JSON.stringify(get_people_action("pack"));
				};

				if (!localStorage.reload) {
					localStorage.reload = 0;
				} else {
					update();

					let every = {};
					every.twenty = JSON.parse(localStorage["20"]);
					every.forty = JSON.parse(localStorage["40"]);
					every.sixty = JSON.parse(localStorage["60"]);

					every.sixty.map(({ name, location, time, tote, cell, action }) => {
						let aa_sixty = { name, location, time, tote, cell, action };
						every.forty.map(({ name, location, time, tote, cell, action }) => {
							let aa_forty = { name, location, time, tote, cell, action };
							every.twenty.map(({ name, location, time, tote, cell, action }) => {
								let aa_twenty = { name, location, time, tote, cell, action };

								people_html.map((people) => {
									//console.log(people.person.innerText.trim());

									if (people.person.innerText.trim() == "buradani") {
										console.log(people.action);
									}

									if (
										aa_sixty.name === aa_twenty.name &&
										people.person.innerText.trim() == aa_sixty.name
									) {
										if (
											convert_seconds(
												aa_sixty.time.since.min,
												aa_sixty.time.since.sec
											) !=
												convert_seconds(
													aa_forty.time.since.min,
													aa_forty.time.since.sec
												) &&
											convert_seconds(
												aa_forty.time.since.min,
												aa_forty.time.since.sec
											) !=
												convert_seconds(
													aa_twenty.time.since.min,
													aa_twenty.time.since.sec
												)
										) {
											people.action.innerText = `${aa_sixty.action.role} (3+/min)`;
											people.action.style.backgroundColor = "#F2D974";
										}

										if (
											convert_seconds(
												aa_forty.time.since.min,
												aa_forty.time.since.sec
											) ==
											convert_seconds(
												aa_twenty.time.since.min,
												aa_twenty.time.since.sec
											)
										) {
											people.action.innerText = `${aa_sixty.action.role} (2/min)`;
											people.action.style.backgroundColor = "#ACFFAD";
										}

										if (
											convert_seconds(
												aa_sixty.time.since.min,
												aa_sixty.time.since.sec
											) ==
											convert_seconds(
												aa_twenty.time.since.min,
												aa_twenty.time.since.sec
											)
										) {
											people.action.style.backgroundColor = "#E7625F";
											people.action.setAttribute("class", "blink_me");
											people.action.innerText = `${aa_sixty.action.role} (1/min)`;
										}
									}
								});
							});
						});
					});

					if (localStorage.reload == 3) {
						localStorage.reload = 0;
					}

					localStorage.reload++;
				}
			}
		};
		xhr.onerror = () =>
			console.log(
				"There was a network error. Check your internet connection and try again."
			);
		xhr.send();
		return xhr.response;
	};

	//checkRate();

	let run = setInterval(() => {
		checkRate();
		clearInterval(() => {
			run;
			debugger;
		}, 6000);
	}, update_seconds);
	//setTimeout(() => localStorage.clear(), 600001)
})();
