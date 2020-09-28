const callbacks = [];
const allWords = [];
var eventWordMap = {};
var wait = false;
var partialBuffer = "";

function addToCommands(words, command) {
	words.forEach(function(w) {
		eventWordMap[w] = command;
		allWords.push(w);
	});
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
	if (typeof reset === 'function') {
		reset();
	}
	// var wordHandled = false;
	// res.result.forEach((x) => {
	// 	console.log(x.word)
	// 	if (allWords.includes(x.word)) {
	// 		wordHandled = true;
	// 		wait = true
	// 		handleIt(x.word, x.conf);
	// 	}
	// });
	wait = false;
}


function handlePartial(res, handleIt) {
	var wordHandled = false;
	partialBuffer = res.partial;
	// console.log(partialBuffer);
	res.partial.split(' ').forEach((x) => {
		// console.log(x); //// 
		if (allWords.includes(x)) {
			wordHandled = true;
			wait = true
			handleIt(x.word, 1);
			return wordHandled
		}
	});

}


function sendCommand(w, c=0) {
	// if (c >= .5) {
	const action = eventWordMap[w];
	console.log(`${w} detected with confidence ${c}: action ${action}`);
	for (const callback of callbacks) {
		callback(action);
	}
	// }
}


thisRec = new VoskJS.Recognizer(langModel);
thisRec.onresult = (result) => {

	if (!wait && result.partial) {
		// console.log("=P= " + result.partial)
		if (result.partial != partialBuffer) {
			handlePartial(result, sendCommand);
		}
	}
	

	if (result.result) {
		handleResult(result, sendCommand);
	}
};
thisRec.getActive().then((active) => thisRec.setActive(!active));
