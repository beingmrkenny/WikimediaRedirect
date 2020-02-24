chrome.storage.local.get(null, result => {
	let inputs = {
		"enabled" : true,
		"redirect-edit-page" : true
	};
	for (let name in result) {
		let input = document.querySelector(`[name="${name}"]`);
		input.checked = result[name];
		delete inputs[name];
	}
	for (let name in inputs) {
		let input = document.querySelector(`[name="${name}"]`);
		input.checked = inputs[name];
		delete inputs[name];
	}
});

for (let input of document.querySelectorAll('.options-input')) {
	input.addEventListener('change', function () {
		chrome.storage.local.set({ [this.name] : this.checked });
	});
}
