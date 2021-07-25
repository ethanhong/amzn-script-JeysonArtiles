// ==UserScript==
// @name         Check Rates
// @namespace    mailto:jeyartil@amazon.com
// @version      0.2
// @description  Highlight rates.
// @author       jeyartil
// @match        https://aftlite-na.amazon.com/labor_tracking/uph_drilldown
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/aftlite_checkRate.js
// @updateURL    https://raw.githubusercontent.com/JeysonArtiles/amzn/master/aftlite_checkRate.js
// ==/UserScript==

(function () {
	"use strict";

	document.onkeyup = function (e) {
		if (e.shiftKey && e.which == 82) {
			checkRate();
			//location.reload()
		}
	};

	let pickers = [...document.querySelectorAll("tbody")][1];
	let path = document.querySelector("input[name=function]");

	document.querySelector("form").addEventListener("submit", (event) => {
		pickers.lastElementChild.innerHTML = `<td>Pickers</td><td><b>${localStorage.pickersCount}</td></b>`;
	});

	localStorage.currentRate = Number(
		Number([...document.querySelectorAll("tr>td")].slice(2, 8)[1].innerText).toFixed(3)
	);
	localStorage.currentUnits = Number(
		Number([...document.querySelectorAll("tr>td")].slice(2, 8)[3].innerText).toFixed(3)
	);

	localStorage.pickersCount = "--";
	pickers.innerHTML += `<td>Pickers</td><td><b>${localStorage.pickersCount}</td></b>`;

	const checkRate = () => {
		let rate = prompt("Desired Rate", 70) || 70;

		let table = [...document.querySelectorAll("tr>td")].slice(2, 8);

		let par = {};
		par.rate = {
			pointer: table[1],
			value: Number(Number(table[1].innerText).toFixed(3)),
		};

		par.units = {
			pointer: table[3],
			value: Number(Number(table[3].innerText).toFixed(3)),
		};
		par.duration = {
			title: table[4],
			pointer: table[5],
			value: Number(Number(table[5].innerText).toFixed(3)),
		};

		let expected_units = par.duration.value * rate;
		let expected_rate = (expected_units / par.duration.value).toFixed(0);

		par.rate.pointer.innerHTML = `<b>${localStorage.currentRate}</b> / ${expected_rate}`;
		par.units.pointer.innerHTML = `<b>${localStorage.currentUnits}</b> / ${expected_units}`;
		par.duration.pointer.innerHTML = `<b>${par.duration.value}</b>`;

		let aa = [...document.querySelectorAll(`tr[id=${path.value}]`)];

		let count = 0;
		aa.map((picker) => {
			// console.log(picker.cells);
			count++;

			let aa = {};
			aa.name = { root: picker.cells[0], value: picker.cells[0].innerText };

			aa.agency = { root: picker.cells[1], value: picker.cells[1].innerText };
			aa.units = { root: picker.cells[2], value: Number(picker.cells[2].innerText) };
			aa.hours = { root: picker.cells[3], value: Number(picker.cells[3].innerText) };
			aa.rate = { root: picker.cells[4], value: Number(picker.cells[4].innerText) };

			if (aa.rate.value < rate && aa.hours.value < rate / aa.hours.value) {
				// aa.units.root.innerText += " (slow)";
				picker.style.backgroundColor = "#F38BA0";
				picker.setAttribute("class", "blink_me");
			} else {
				picker.style.backgroundColor = "#ACFFAD";
				picker.removeAttribute("blink_me");
			}

			//const aa_name = aa.name.value.split(" ").pop();
			//const aaName = `${count} - ${aa_name}`;
			//aa.name.root.innerHTML = aaName;
		});

		localStorage.pickersCount = count;

		pickers.lastElementChild.innerHTML = `<td>Pickers</td><td><b>${localStorage.pickersCount}</td></b>`;
	};
})();
