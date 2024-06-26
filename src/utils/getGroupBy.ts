import { differenceInDays, startOfDay, endOfDay } from "date-fns";

export function getGroupByFromRange(startDate: string, endDate: string) {
	const start = startOfDay(new Date(startDate));
	const end = endOfDay(new Date(endDate));

	const diff = differenceInDays(end, start);

	if (diff >= 365 * 3 - 1) {
		return "Yearly";
	} else if (diff >= 30 * 3 - 1) {
		return "Monthly";
	} else {
		return "Daily";
	}
}
