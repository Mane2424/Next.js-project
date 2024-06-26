import { RootState } from "../index";

const account = (state: RootState) => state.account.account;
const permissions = (state: RootState) => state.account.permissions;
const pipeLines = (state: RootState) => state.account.pipeLines;

export const userAccount = {
	permissions,
	pipeLines,
	account,
};
