chrome.runtime.onInstalled.addListener(function (e) {
	chrome.storage.sync.get("fillers", function (fillers) {
		if (EasySignup.isEmpty(fillers)) {
			if (chrome.runtime.openOptionsPage) {
				chrome.runtime.openOptionsPage();
			} else {
				window.open(chrome.runtime.getURL("src/options.html"));
			}
		}
	});
});
