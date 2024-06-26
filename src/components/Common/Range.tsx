import React, { useEffect, useRef, useState } from "react";
import "@/styles/range.scss";

export const Range = (value: any) => {
	const [ratings, setRatings] = useState({
		min: value?.selectedValue?.min ?? 1,
		max: value?.selectedValue?.max ?? 10,
	});
	const range1 = useRef<any>();
	const range2 = useRef<any>();
	const selectedRange = useRef<any>();
	const updateSelectedRange = () => {
		const start = Math.min(range1.current.value, range2.current.value);
		const end = Math.max(range1.current.value, range2.current.value);
		selectedRange.current.style.left = start * 10 + "%";
		selectedRange.current.style.width = (end - start) * 10 + "%";
	};
	const onChange = (elem: string, rating: number) => {
		const newMinValue: number = elem === "min" ? rating : ratings.min;
		const newMaxValue: number = elem === "max" ? rating : ratings.max;
		if (newMinValue <= newMaxValue) {
			value?.handleChange({ ...ratings, [elem]: rating }, "Rating");
			setRatings({ ...ratings, [elem]: rating });
		} else {
			value?.handleChange(
				{ ...ratings, [elem === "max" ? "min" : "max"]: rating },
				"Rating"
			);
			setRatings({ ...ratings, [elem === "max" ? "min" : "max"]: rating });
		}
	};
	useEffect(() => {
		range1.current?.addEventListener("input", updateSelectedRange);
		range2.current?.addEventListener("input", updateSelectedRange);
		updateSelectedRange();
		return () => {
			range1.current?.removeEventListener("input", updateSelectedRange);
			range2.current?.removeEventListener("input", updateSelectedRange);
		};
	}, []);
	return (
		<div className='flex flex-col justify-center'>
			<div className='flex justify-center gap-2'>
				<div className='flex h-10 w-10 items-center justify-center border text-[30px] dark:text-white'>
					{ratings.min}
				</div>
				<div className='flex items-center justify-center'>to</div>
				<div className='flex h-10 w-10 items-center justify-center border text-[30px] dark:text-white'>
					{ratings.max}
				</div>
			</div>
			<div className='range-slider'>
				<input
					type='range'
					min='0'
					max='10'
					value={ratings.min}
					className='range min'
					onChange={(e) => onChange("min", +e.target.value)}
					id='range1'
					ref={range1}
				/>
				<input
					type='range'
					min='0'
					max='10'
					value={ratings.max}
					onChange={(e) => onChange("max", +e.target.value)}
					className='range max'
					id='range2'
					ref={range2}
				/>
				<div className='selected-range' ref={selectedRange}></div>
			</div>
		</div>
	);
};
