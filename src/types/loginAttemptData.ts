export interface ILoginAttemptData {
	browserInfo: string;
	clientIpAddress: string;
	clientName?: string | null;
	creationTime: string;
	result: string;
	tenancyName: string;
	userNameOrEmail?: string;
}
