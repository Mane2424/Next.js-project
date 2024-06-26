import React, { useEffect, useState } from "react";
import InputGroup from "../Dashboard/InputGroup";

export const FilterInput = ({
	data,
	handleChange,
	componentName,
	displayName,
}: {
	data: any;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	componentName: string;
	displayName: string;
}) => {
	const [newData, setNewData] = useState<any>("");
	useEffect(() => {
		setNewData(data);
	}, [data, componentName]);
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleChange(e);
		setNewData(e.target.value);
	};
	return (
		<InputGroup
			label={displayName}
			placeholder={`Enter ${displayName}`}
			height='50px'
			handleChange={onChange}
			value={newData}
			name={componentName}
		/>
	);
};
