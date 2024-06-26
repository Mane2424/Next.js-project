export function formatTimestamp(timestamp: string) {
	const timestampDate: Date = new Date(timestamp);
	const currentDate: Date = new Date();
	const timeDifference: number = +currentDate - +timestampDate;
	const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	const hours = Math.floor(timeDifference / (1000 * 60 * 60));
	const minutes = Math.floor(timeDifference / 1000 / 60);
	const seconds = Math.floor(timeDifference / 1000);

	// Format the output string
	if (days > 365) {
		const yearsAgo = Math.floor(days / 365);
		const formattedString = `${yearsAgo} year${
			yearsAgo > 1 ? "s" : ""
		} ago (${timestampDate.getFullYear()}-${(timestampDate.getMonth() + 1)
			.toString()
			.padStart(2, "0")}-${timestampDate
			.getDate()
			.toString()
			.padStart(2, "0")} ${timestampDate
			.getHours()
			.toString()
			.padStart(2, "0")}:${timestampDate
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${timestampDate
			.getSeconds()
			.toString()
			.padStart(2, "0")})`;
		return formattedString;
	} else if (days > 30) {
		const monthsAgo = Math.floor(days / 30);
		const formattedString = `${monthsAgo} month${
			monthsAgo > 1 ? "s" : ""
		} ago (${timestampDate.getFullYear()}-${(timestampDate.getMonth() + 1)
			.toString()
			.padStart(2, "0")}-${timestampDate
			.getDate()
			.toString()
			.padStart(2, "0")} ${timestampDate
			.getHours()
			.toString()
			.padStart(2, "0")}:${timestampDate
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${timestampDate
			.getSeconds()
			.toString()
			.padStart(2, "0")})`;
		return formattedString;
	} else if (days > 0) {
		const formattedString = `${days} day${
			days > 1 ? "s" : ""
		} ago (${timestampDate.getFullYear()}-${(timestampDate.getMonth() + 1)
			.toString()
			.padStart(2, "0")}-${timestampDate
			.getDate()
			.toString()
			.padStart(2, "0")} ${timestampDate
			.getHours()
			.toString()
			.padStart(2, "0")}:${timestampDate
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${timestampDate
			.getSeconds()
			.toString()
			.padStart(2, "0")})`;
		return formattedString;
	} else if (hours > 0) {
		const formattedString = `${
			hours === 1 ? "an hour" : hours + " hours"
		} ago (${timestampDate.getFullYear()}-${(timestampDate.getMonth() + 1)
			.toString()
			.padStart(2, "0")}-${timestampDate
			.getDate()
			.toString()
			.padStart(2, "0")} ${timestampDate
			.getHours()
			.toString()
			.padStart(2, "0")}:${timestampDate
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${timestampDate
			.getSeconds()
			.toString()
			.padStart(2, "0")})`;
		return formattedString;
	} else if (minutes > 0) {
		const formattedString = `${
			minutes === 1 ? "a minute" : minutes + " minutes"
		} ago (${timestampDate.getFullYear()}-${(timestampDate.getMonth() + 1)
			.toString()
			.padStart(2, "0")}-${timestampDate
			.getDate()
			.toString()
			.padStart(2, "0")} ${timestampDate
			.getHours()
			.toString()
			.padStart(2, "0")}:${timestampDate
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${timestampDate
			.getSeconds()
			.toString()
			.padStart(2, "0")})`;
		return formattedString;
	} else {
		const formattedString = `${
			seconds === 1 ? "a second" : seconds + " seconds"
		} ago (${timestampDate.getFullYear()}-${(timestampDate.getMonth() + 1)
			.toString()
			.padStart(2, "0")}-${timestampDate
			.getDate()
			.toString()
			.padStart(2, "0")} ${timestampDate
			.getHours()
			.toString()
			.padStart(2, "0")}:${timestampDate
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${timestampDate
			.getSeconds()
			.toString()
			.padStart(2, "0")})`;
		return formattedString;
	}
}
