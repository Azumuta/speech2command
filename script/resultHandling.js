// allWords = ['volgende', 'vorige']

const callbacks = [];
const eventWordMap = {
	'vorige': 'navigate-backward',
	'volgende': 'navigate-forward',
};

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
	if (!wordHandled) {
		// console.log("Got undefined word: " + res.text);
		if (allWords.includes("<und>")) {
			handleIt('<und>', 1);
		}
	}
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