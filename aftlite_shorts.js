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
