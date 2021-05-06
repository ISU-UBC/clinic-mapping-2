import Core from "./tools/core.js";
import Application from "./application.js";
import Net from "./tools/net.js";

let promiseOne = Net.JSON(`./application.json`);
let promiseTwo = Core.WaitForDocument();

Promise.all([promiseOne, promiseTwo]).then(Start, Fail);

function Start(responses) {	
	new Application(document.body, responses[0]);
}

function Fail(response) {
	alert("Unable to load application.");
	throw(new Error("Unable to load application."));
}