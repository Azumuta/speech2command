// todo script/VoskJS.js inladen

// const langModel = "model-nl.tar.gz";
// const allWords = ['volgende', 'vorige'];
const callbacks = [];
const allWords = []
var eventWordMap;

function addToCommands (words, command) {
	words.forEach(function(w) {
		eventWordMap[w] = command;
		allWords.push(w);
	})
}

addToCommands(next, 'navigate-forward');
addToCommands(prev, 'navigate-backward');


window.iridium = {};
window.iridium.onExternalNavigate = (callback) => {
	callbacks.push(callback);

	return () => {
			const callbackIndex = callbacks.indexOf(callback);
			callbacks.splice(callbackIndex, 1);
	};
};


function handleResult(res, handleIt, reset=null) {
	if (typeof reset == "function") {
		reset();
	}
	var wordHandled = false;
	words = res.result;
	words.forEach((x) => {
		if (allWords.includes(x.word)) {
			wordHandled = true;
			handleIt(x.word, x.conf);
		}
	});
}

function sendCommand(w, c) {
	if (c >= .5) {
		const action = eventWordMap[w];
		console.log(`${w} detected with confidence ${c}: action ${action}`);
		for (const callback of callbacks) {
			callback(action);
		}
	}
}

thisRec = new VoskJS.Recognizer(langModel);
thisRec.onresult = result => {
	if (result.result) {
		handleResult(result, sendCommand);
	}
}
thisRec.getActive().then(active => thisRec.setActive(!active));