function handleResult(res) {
	resetColors();
	var wordMarked = false;
	words = res.result;
	words.forEach((x) => {
		if (allWords.includes(x.word)) {
			console.log(x.word + " detected");
			wordMarked = true;
			markWord(x.word, x.conf);
		}
	});
	if (!wordMarked) {
		console.log("No known words detected.");
		console.log("Got: " + res.text);
		markWord('<und>', 1);
	}
}