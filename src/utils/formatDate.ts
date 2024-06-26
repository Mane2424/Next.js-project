export const formatDate = (dateString: string) => {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const date = new Date(dateString);
	const month = months[date.getMonth()];
	const day = ("0" + date.getDate()).slice(-2);
	const year = date.getFullYear();
	let hours = date.getHours();
	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12;
	const minutes = ("0" + date.getMinutes()).slice(-2);

	return `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;
};
