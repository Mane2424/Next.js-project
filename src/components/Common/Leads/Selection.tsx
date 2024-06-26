import React from "react";
import { CustomCheckbox } from "../CheckBox/CheckBox";

export const Selection = (value: any) => {
	const onChange = (data: any, checked: boolean) => {
		value?.handleChange(data, value?.componentName, checked);
	};
	return (
		<div
			className='flex w-full flex-col gap-1 pl-4'
			style={{
				height: "calc(100vh - 200px)",
				overflowY: "auto",
			}}
		>
			{value?.data?.map((elem: any, index: number) => {
				return (
					<CustomCheckbox
						displayText={elem.name}
						value={elem.id}
						onChange={onChange}
						key={index}
						selected={value.selectedValue.includes(elem.id)}
						name={value?.componentName}
					/>
				);
			})}
		</div>
	);
};
