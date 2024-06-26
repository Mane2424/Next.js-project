export const toggleFullScreen = () => {
	if (!document.fullscreenElement) {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
};
