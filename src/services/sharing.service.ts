export class SharingService {
	static popWindow(url: string) {
		const left = (screen.width - 680) / 2;
		const top = (screen.height - 580) / 2;
		const params =
			"menubar=no,toolbar=no,resizable=yes,scrollbars=no,status=no,width=680,height=580,top=" +
			top +
			",left=" +
			left; // width='+width+',height='+height+',top='+top+',left='+left
		window.open(url, "NewWindow", params);
	}

	static shareInFacebook(pageURL: string) {
		this.popWindow(
			"https://www.facebook.com/sharer.php?u=" + encodeURIComponent(pageURL)
		);
	}

	static shareInTwitter(pageURL: string, text: string, hashtag: string = "") {
		this.popWindow(
			"https://twitter.com/intent/tweet?url=" +
				encodeURIComponent(pageURL) +
				"&text=" +
				encodeURIComponent(text) +
				"&hashtags=" +
				encodeURIComponent(hashtag) +
				"&original_referer=&ref_src=&tw_p=tweetbutton&url="
		);
	}

	static shareInLinkedin(pageURL: string, subject: string, message: string) {
		this.popWindow(
			"https://www.linkedin.com/shareArticle?mini=true&title=" +
				encodeURIComponent(subject) +
				"&source=&summary=" +
				encodeURIComponent(message) +
				"&url=" +
				encodeURIComponent(pageURL)
		);
	}

	static shareInPinterest(
		pageURL: string,
		picture: string,
		message: string,
		hashtags: string = ""
	) {
		this.popWindow(
			"https://www.pinterest.com/pin/create/button/?mini=true&media=" +
				encodeURIComponent(picture) +
				"&description=" +
				encodeURIComponent(message) +
				"&hashtags=" +
				encodeURIComponent(hashtags) +
				"&url=" +
				encodeURIComponent(pageURL)
		);
	}

	static shareInWhatsapp(pageURL: string) {
		this.popWindow(
			"https://api.whatsapp.com/send?text=" + encodeURIComponent(pageURL)
		);
	}

	static shareVieEmail(subject: string, message: string) {
		this.popWindow(
			"mailto:?subject=" +
				encodeURIComponent(subject) +
				"&body=" +
				encodeURIComponent(message)
		);
	}
}
