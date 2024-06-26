import { createSlice } from "@reduxjs/toolkit";
// import { leadsService } from "./leadsService";
// import { IGlobalState } from "@/types/globalState";

// const contactsByRegion: IGlobalState<IContactByRegion[]> = {
// 	isLoading: false,
// 	isSuccess: false,
// 	isError: false,
// 	data: null,
// };

const initialState = {};

const leadsSlice = createSlice({
	name: "leads",
	initialState,
	reducers: {
		resetStoreAuth: () => {},
	},
	extraReducers: (builder) => {
		builder;
	},
});

export const leadsActions = leadsSlice.actions;
export default leadsSlice.reducer;
