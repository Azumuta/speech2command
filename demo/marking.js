function markWord(word, conf) {
	if (word === '<unk>') {
		word = 'UNK';
	} else if (word === '<und>') {
		word = 'UND';
	}
	const entity = '#' + word;
	$(entity).css('background-color', 'rgba(0, 255, 0, ' + conf + ')');
}
function resetColors() {
	$('td').css('background-color', 'white');
}