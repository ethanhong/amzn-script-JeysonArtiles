// ==UserScript==
// @name         Shorts - Get Date
// @namespace    mailto:jeyartil@amazon.com
// @version      0.1
// @description  Get Date
// @author       jeyartil
// @match        https://aftlite-na.amazon.com/shorts_report*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/JeysonArtiles/amzn/master/aftlite_shorts.js
// @updateURL  	 https://raw.githubusercontent.com/JeysonArtiles/amzn/master/aftlite_shorts.js
// ==/UserScript==

getTodaysDate = () => {
	const today = new Date();
	const date =
		today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

	const year = today.getFullYear();
	const month =
		today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
	const day = today.getDate();

	const todaysDate = `${year}-${month}-${day}`;

	const input = document.querySelector("input[name=date]");

	input.value = todaysDate;
};
//s
getTodaysDate();
