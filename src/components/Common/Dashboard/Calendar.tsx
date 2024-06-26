import React, { useEffect, useRef, useState } from "react";
import "@/styles/calendar.scss";
import Calendar from "react-calendar";
import {
	addDays,
	endOfDay,
	startOfDay,
	addMonths,
	subQuarters,
	startOfQuarter,
	endOfQuarter,
	startOfYear,
	endOfYear,
} from "date-fns";
import Image from "next/image";
import { Button } from "./Button";
import { useTheme } from "next-themes";

type Value = [Date, Date];
interface ICalendarProps {
	onChangeDateRange: (value: {
		label: string;
		startDate: Date;
		endDate: Date;
	}) => void;
	start: Date;
	end: Date;
	changeValue?: any;
}
const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const monts = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
const ranges: { label: string; range: Value }[] = [
	{
		label: "Yesterday",
		range: [
			startOfDay(addDays(new Date(), -1)),
			endOfDay(addDays(new Date(), -1)),
		],
	},
	{
		label: "Today",
		range: [startOfDay(new Date()), endOfDay(new Date())],
	},
	{
		label: "Last 7 days",
		range: [
			startOfDay(addDays(new Date(), -7)),
			endOfDay(addDays(new Date(), -1)),
		],
	},
	{
		label: "Last 30 days",
		range: [startOfDay(addDays(new Date(), -29)), endOfDay(new Date())],
	},
	{
		label: "Last Week",
		range: [
			startOfDay(addDays(new Date(), -new Date().getDay() - 6)),
			endOfDay(addDays(new Date(), -new Date().getDay())),
		],
	},
	{
		label: "This Week",
		range: [
			startOfDay(addDays(new Date(), -new Date().getDay() + 1)),
			endOfDay(addDays(new Date(), 7 - new Date().getDay())),
		],
	},
	{
		label: "Last Month",
		range: [
			startOfDay(
				addDays(
					new Date(),
					-new Date().getDate() -
						new Date(
							new Date().getFullYear(),
							new Date().getMonth() - 1,
							0
						).getDate() -
						1
				)
			),
			endOfDay(addDays(new Date(), -new Date().getDate())),
		],
	},
	{
		label: "This Month",
		range: [
			startOfDay(addDays(new Date(), 1 - new Date().getDate())),
			endOfDay(
				addDays(
					new Date(),
					new Date(
						new Date().getFullYear(),
						new Date().getMonth(),
						0
					).getDate() -
						new Date().getDate() -
						1
				)
			),
		],
	},
	{
		label: "Last Quarter",
		range: [
			startOfQuarter(subQuarters(new Date(), 1)),
			endOfQuarter(subQuarters(new Date(), 1)),
		],
	},
	{
		label: "This Quarter",
		range: [startOfQuarter(new Date()), endOfQuarter(new Date())],
	},
	{
		label: "Last Year",
		range: [
			startOfYear(addMonths(new Date(), -12)),
			endOfYear(addMonths(new Date(), -12)),
		],
	},
	{
		label: "This Year",
		range: [startOfYear(new Date()), endOfYear(new Date())],
	},

	{
		label: "All Available Dates",
		range: [startOfDay(new Date("2000-01-01")), endOfYear(new Date())],
	},
];
export const CustomCalendar: React.FC<ICalendarProps> = ({
	start,
	end,
	onChangeDateRange,
	changeValue,
}) => {
	const [startDate, setStartDate] = useState<Date>(start);
	const [endDate, setEndDate] = useState<Date>(end);
	const [isActiveStartInput, setIsActiveStartInput] = useState<boolean>(false);
	const [isActiveEndInput, setIsActiveEndInput] = useState<boolean>(false);
	const [selectedRange, setSelectedRange] = useState<string>("This Year");
	const [value, setValue] = useState<Value>([startDate, endDate]);
	const startDateRef = useRef<any>(null);
	const endDateRef = useRef<any>(null);
	const { theme } = useTheme();

	const inputFormat = (days: any) => {
		const dateObj = new Date(days);
		const year = dateObj.getFullYear();
		const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		const day = ("0" + dateObj.getDate()).slice(-2);
		return year + "-" + month + "-" + day;
	};
	const onChangeValue = (value: any) => {
		setValue(value);
		setStartDate(value[0]);
		setEndDate(value[1]);
		setSelectedRange(`${inputFormat(value[0])} - ${inputFormat(value[1])}`);
		changeValue && changeValue(value);
	};
	function reverseDateFormat(formattedDate: Date) {
		const parts = formattedDate.toString().split("-");
		const year = parts[0];
		const month = parts[1];
		const day = parts[2];
		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const monthName = monthNames[parseInt(month, 10) - 1];

		return new Date(monthName + " " + day + " " + year + " 00:00:00");
	}
	const changeRange = (days: Value) => {
		setValue(days);
		setStartDate(days[0]);
		setEndDate(days[1]);
	};
	const onChangeInputs = (day: any, type: string) => {
		if (type === "start") {
			setStartDate(reverseDateFormat(day));
		} else {
			setEndDate(reverseDateFormat(day));
		}
	};
	const applyDateRange = () => {
		onChangeDateRange({
			label: selectedRange,
			startDate,
			endDate,
		});
	};
	useEffect(() => {
		if (!isActiveStartInput && !isActiveEndInput) return;
		const setInput = (e: any, type: string) => {
			if (
				type === "start" &&
				e.key === "Enter" &&
				startDateRef.current?.value
			) {
				const newDate = new Date(startDateRef.current?.value);
				setStartDate(newDate);
				setValue([newDate, endDate]);
				setIsActiveStartInput(false);
				setSelectedRange(`${inputFormat(newDate)} - ${inputFormat(endDate)}`);
				startDateRef.current?.blur();
			} else if (
				type === "end" &&
				e.key === "Enter" &&
				endDateRef.current?.value
			) {
				const newDate = new Date(endDateRef.current?.value);
				setEndDate(newDate);
				setValue([startDate, newDate]);
				setIsActiveEndInput(false);
				setSelectedRange(`${inputFormat(startDate)} - ${inputFormat(newDate)}`);
				endDateRef.current?.blur();
			}
		};

		document
			.getElementById("start_date")
			?.addEventListener("keypress", (e) => setInput(e, "start"));
		document
			.getElementById("end_date")
			?.addEventListener("keypress", (e) => setInput(e, "end"));
		return () => {
			window.removeEventListener("keypress", (e) => {
				setInput(e, "start");
				setInput(e, "end");
			});
		};
	}, [isActiveStartInput, isActiveEndInput]);

	useEffect(() => {
		if (startDate?.getTime()) {
			if (startDate.getTime() > endDate.getTime()) {
				setValue([endDate, startDate]);
				setEndDate(startDate);
				setStartDate(endDate);
				setSelectedRange(`${inputFormat(startDate)} - ${inputFormat(endDate)}`);
			}
		}
	}, [startDate, endDate]);
	const formatShortWeekday = (locale: string | undefined, date: Date) =>
		weekDays[date.getDay()];
	const formatMonth = (locale: string | undefined, date: Date) =>
		monts[date.getMonth()];
	const formatMonthYear = (locale: string | undefined, date: Date) =>
		`${monts[date.getMonth()]} ${date.getFullYear()}`;
	return (
		<div className='py-15px gap-20px flex flex-col items-center'>
			{!changeValue && (
				<div className='flex w-full justify-end pb-5'>
					<div className='w-[100px]'>
						<Button height='35px' onClick={() => applyDateRange()}>
							Apply
						</Button>
					</div>
				</div>
			)}
			<div className='flex flex-col gap-3'>
				<div className='flex h-8 gap-8'>
					<div className='flex gap-1'>
						<Image
							src='/images/icon/CalendarPng.png'
							alt='calendar1'
							height={32}
							width={32}
						/>
						{!isActiveStartInput ? (
							<input
								type='date'
								value={inputFormat(startDate) || inputFormat(new Date())}
								onChange={(e) => onChangeInputs(e.target.value, "start")}
								onClick={() => {
									setIsActiveStartInput(true);
									startDateRef.current?.focus();
								}}
								className='dark:bg-[#161f36] dark:text-white'
							/>
						) : (
							<input
								type='date'
								id='start_date'
								ref={startDateRef}
								className='dark:bg-[#161f36] dark:text-white'
							/>
						)}
					</div>
					<Image
						src='/images/icon/arrowRight.svg'
						alt='arrowRight'
						height={17}
						width={17}
					/>
					<div className='flex gap-1'>
						<Image
							src='/images/icon/CalendarPng.png'
							alt='calendar1'
							height={32}
							width={32}
						/>
						{!isActiveEndInput ? (
							<input
								type='date'
								value={inputFormat(endDate) || inputFormat(new Date())}
								onChange={(e) => onChangeInputs(e.target.value, "end")}
								onClick={() => {
									setIsActiveEndInput(true);
									endDateRef.current?.focus();
								}}
								className='dark:bg-[#161f36] dark:text-white'
							/>
						) : (
							<input
								type='date'
								id='end_date'
								ref={endDateRef}
								className='dark:bg-[#161f36] dark:text-white'
							/>
						)}
					</div>
				</div>
				<Calendar
					formatShortWeekday={formatShortWeekday}
					formatMonthYear={formatMonthYear}
					formatMonth={formatMonth}
					selectRange={true}
					onChange={onChangeValue}
					value={value}
					locale='en'
					className={`${theme === "dark" ? "dark-calendar" : ""}`}
				/>
				<div className='grid grid-cols-2 items-center justify-center gap-4'>
					{ranges.map((elem, index) => {
						return (
							<div
								className={` ${
									index === ranges.length - 1 ? "col-span-2" : ""
								} ${
									elem.label === selectedRange
										? "calendar-button-active dark:bg-[#161f36]"
										: ""
								} cursor-pointer bg-[#f9fbfc] p-1 text-center text-[13px] font-normal text-[#686f76] dark:bg-[#161f36] dark:text-white`}
								key={elem.label}
								onClick={() => {
									changeRange(elem.range);
									setSelectedRange(elem.label);
								}}
							>
								{elem.label}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
