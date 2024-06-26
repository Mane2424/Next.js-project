import { CustomCalendar } from "@/components/Common/Dashboard/Calendar";
import { FilterInput } from "@/components/Common/Leads/FilterInput";
import { Selection } from "@/components/Common/Leads/Selection";
import { Range } from "@/components/Common/Range";
import { useEffect, useState } from "react";
import buildQuery from "odata-query";

export const filterKeys: {
	caption: string;
	field: string;
	operator?: string;
	displayName: string;
}[] = [
	{
		caption: "name",
		field: "",
		operator: "startswith",
		displayName: "Name",
	},
	{
		caption: "email",
		field: "Email",
		displayName: "Email",
	},
	{
		caption: "xref",
		field: "contactXref",
		displayName: "Xref",
	},
	{
		caption: "affiliateCode",
		field: "ContactAffiliateCode",
		displayName: "Affiliate Code",
	},
	{
		caption: "creation",
		field: "LeadDate",
		displayName: "Date Created",
	},
	{
		caption: "stages",
		field: "Stage",
		displayName: "Stage",
	},
	{
		caption: "phone",
		field: "Phone",
		displayName: "Phone",
	},
	{
		caption: "states",
		field: "",
		displayName: "Country/State",
	},
	{
		caption: "city",
		field: "",
		operator: "startswith",
		displayName: "City",
	},
	{
		caption: "streetAddress",
		field: "",
		operator: "contains",
		displayName: "Street Address",
	},
	{
		caption: "zipCode",
		field: "",
		operator: "startswith",
		displayName: "Zip Code",
	},
	{
		caption: "Industry",
		field: "",
		operator: "startswith",
		displayName: "Industry",
	},
	{
		caption: "List",
		field: "ListId",
		displayName: "Lists",
	},
	{
		caption: "Tag",
		field: "TagId",
		displayName: "Tags",
	},
	{
		caption: "Rating",
		field: "Rating",
		displayName: "Rating",
	},
	{
		caption: "Star",
		field: "StarId",
		displayName: "Star",
	},
];

export const DispayedComponent: React.FC<any> = ({ value }): any => {
	const [selectedComponent, setSelectedComponent] = useState(<></>);
	const components: any = {
		name: <FilterInput {...value} />,
		email: <FilterInput {...value} />,
		xref: <FilterInput {...value} />,
		affiliateCode: <FilterInput {...value} />,
		creation: (
			<CustomCalendar
				start={value.data?.startDate}
				end={value.data?.endDate}
				onChangeDateRange={value.handleChange}
				changeValue={value.handleChange}
			/>
		),
		stages: <Selection {...value} />,
		phone: <FilterInput {...value} />,
		states: <Selection {...value} />,
		city: <FilterInput {...value} />,
		streetAddress: <FilterInput {...value} />,
		zipCode: <FilterInput {...value} />,
		Industry: <FilterInput {...value} />,
		List: <Selection {...value} />,
		Tag: <Selection {...value} />,
		Star: <Selection {...value} />,
		Rating: <Range {...value} />,
	};
	useEffect(() => {
		setSelectedComponent(components[value.componentName]);
	}, [value.componentName]);

	return selectedComponent;
};

export const changeFilterData = (
	filterData: any,
	pipelineId: any,
	selectedStages: any,
	selectedStates: any,
	selectedTags: any,
	selectedList: any,
	selectedStar: any,
	selectedRating: any,
	selectedTime: any
) => {
	const filterLinkData: any = [
		{ Pipelineid: pipelineId },
		{ or: [] },
		{},
		[],
		[],
		[],
		{ LeadDate: {} },
		{ or: [] },
		[],
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{ Rating: {} },
		{},
	];

	for (const property in filterData) {
		if (filterData[property]) {
			if (property === "name" && filterData[property])
				filterLinkData[2] = { Name: { startswith: filterData[property] } };
			if (property === "email" && filterData[property]) {
				filterLinkData[3] = { Email: { in: [filterData[property]] } };
			}
			if (property === "xref" && filterData[property])
				filterLinkData[4] = { ContactXref: { in: [filterData[property]] } };
			if (property === "affiliateCode" && filterData[property])
				filterLinkData[5] = {
					ContactAffiliateCode: { in: [filterData[property]] },
				};
			if (
				property === "creation" &&
				selectedTime.startDate &&
				selectedTime.endDate
			)
				filterLinkData[6] = {
					LeadDate: {
						ge: selectedTime.startDate,
						le: selectedTime.endDate,
					},
				};
			if (property === "stages" && pipelineId && selectedStages.length)
				filterLinkData[7] = {
					or: [
						`PipelineId eq ${pipelineId} and StageId in (${selectedStages.toString()})`,
					],
				};
			if (property === "phone" && filterData[property])
				filterLinkData[8] = { Phone: { in: [filterData[property]] } };
			if (property === "states" && selectedStates)
				filterLinkData[9] = { or: selectedStates };
			if (property === "city" && filterData[property])
				filterLinkData[10] = { City: { startswith: filterData[property] } };
			if (property === "streetAddress" && filterData[property])
				filterLinkData[11] = {
					and: [{ StreetAddress: { contains: filterData[property] } }],
				};
			if (property === "zipCode" && filterData[property])
				filterLinkData[12] = { ZipCode: { startswith: filterData[property] } };
			if (property === "Industry" && filterData[property])
				filterLinkData[13] = { Industry: { startswith: filterData[property] } };
			if (property === "List" && selectedList.length)
				filterLinkData[14] = {
					or: selectedList.map((elm: number) => ({
						ListId: elm,
					})),
				};
			if (property === "Tag" && selectedTags.length)
				filterLinkData[15] = {
					or: selectedTags.map((elm: number) => ({
						TagId: elm,
					})),
				};
			if (property === "Rating" && selectedRating.min && selectedRating.max)
				filterLinkData[16] = {
					Rating: {
						ge: selectedRating.min,
						le: selectedRating.max,
					},
				};
			if (property === "Star" && selectedStar.length)
				filterLinkData[17] = {
					or: selectedStar.map((elm: number) => ({
						StarId: elm,
					})),
				};
		}
	}
	return buildQuery({ filter: filterLinkData });
};
