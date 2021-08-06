onsole.log("THIS IS A TEST FOR DYNAMIC UPDATE");

sessionStorage.tasksPerBatcher = 4;

document.onkeyup = function (e) {
	if (e.shiftKey && e.which == 66) {
		const tasksPerBatcher = prompt("Enter desired tasks per batcher:", 4);
		setTasksPerBatcher(tasksPerBatcher);
	}
};

const setTasksPerBatcher = (number) => {
	sessionStorage.tasksPerBatcher = number;
};

setTimeout(() => {
	updateTasks();
}, 500);

const fetchData = async () => {
	const response = await fetch(
		"https://como-operations-dashboard-iad.iad.proxy.amazon.com/api/store/f170be3c-eda4-43dd-b6bd-2325b4d3c719/activeJobSummary"
	);

	const data = await response.json();
	const tasks = {};
	tasks.total = data.length;
	tasks.inProgress = data.filter(
		({ operationState }) => operationState == "IN_PROGRESS"
	).length;
	tasks.current = data.filter(
		({ operationState }) => operationState == "NONE" || operationState == "IN_PROGRESS"
	).length;
	tasks.partial = data.filter(
		({ operationState, fulfillmentComplete }) =>
			operationState == "COMPLETED" && fulfillmentComplete == false
	).length;
	tasks.complete =
		data.filter(({ operationState }) => operationState == "COMPLETED").length -
		tasks.partial;

	sessionStorage.tasks = JSON.stringify(tasks);

	//console.log(sessionStorage.tasks)
};

//setInterval(() => { fetchData(); updateTasks(sessionStorage.tasks); }, 1000);
let debugUpdating = 0;

const updateTasks = (task) => {
	const tasks = JSON.parse(task);

	const DOM = {};
	DOM.tasks = document.querySelector("h1[data-dtk-test-id='job-grid-title']");
	let recommendedBatchers = (tasks.current / sessionStorage.tasksPerBatcher).toFixed(2);

	//if((tasks.total - tasks.current) / sessionStorage.tasksPErBatcher > tasks.current) recommendedBatchers = (tasks.current / sessionStorage.tasksPerBatcher).toFixed(1);

	//if (recommendedBatchers > tasks.inProgress) recommendedBatchers = tasks.current;
	if (recommendedBatchers < tasks.inProgress) recommendedBatchers = tasks.inProgress;

	debugUpdating++;
	DOM.tasks.innerHTML = `Tasks (${tasks.current})
            <span id="recommendedBatchers" style="margin-left: 1em">BATCHERS:
            <span id="batchers">${tasks.inProgress} / ${recommendedBatchers}</span></span>
            <span id="action"></span> <span style="margin: 1em" hidden>Update Debugger: ${debugUpdating}</span>`;

	DOM.recommendedBatchers = document.querySelector("#recommendedBatchers");
	DOM.batchers = document.querySelector("#batchers");

	DOM.action = document.querySelector("#action");

	if (tasks.inProgress == 0) DOM.recommendedBatchers.style.visibility = "hidden";
};
