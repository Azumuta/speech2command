const callbacks = [];
const allWords = [];
var eventWordMap = {};

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


// source: https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
    var timeout;
    
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}


function handleResult(res, handleIt, reset=null) {
    if (typeof reset === 'function') {
        reset();
    }
    var wordHandled = false;
    if (typeof res.result !== "undefined") {
        // words = res.result;
        res.result.forEach((x) => {
            if (allWords.includes(x.word)) {
                wordHandled = true;
                handleIt(x.word, x.conf);
            }
        });
    }
}


function sendCommand(w, c) {
    // if (c >= .5) {
        const action = eventWordMap[w];
        console.log(`${w} detected with confidence ${c}: action ${action}`);
        for (const callback of callbacks) {
            callback(action);
        }
    // }
}

let hasStarted = false;

const handle = debounce(function(result) {
	handleResult(result, sendCommand); 
	console.log({result});
	console.log('stop');
	hasStarted = false;
}, 250, true);

thisRec = new VoskJS.Recognizer(langModel);
thisRec.onresult = (result) => {
	console.log({hasStarted})

	if (!hasStarted) {
		console.log('start');
		hasStarted = true;
	}
    handle(result);

    // if (result.result) {
    // 	handleResult(result, sendCommand);
    // }
};
thisRec.getActive().then((active) => thisRec.setActive(!active));
