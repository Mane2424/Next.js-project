import axios from "axios";

// eslint-disable-next-line @typescript-eslint/naming-convention
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const login = async (
	email: string,
	password: string,
	rememberClient?: boolean
) => {
	const response = await axios
		.post(`${BASE_URL}/api/TokenAuth/Authenticate`, {
			userNameOrEmailAddress: email,
			password,
			rememberClient,
			twoFactorRememberClientToken: null,
			singleSignIn: false,
			returnUrl: null,
			autoDetectTenancy: true,
		})
		.catch((error) => {
			throw error;
		});
	if (response && response.data && response.data.result) {
		const accessToken = response.data.result.accessToken;
		localStorage.setItem("accessToken", accessToken);
		return accessToken;
	} else {
		throw new Error("Failed to authenticate. Response data is invalid.");
	}
};

export const logout = async () => {
	try {
		await axios.get(`${BASE_URL}/api/TokenAuth/LogOut`);
		localStorage.removeItem("accessToken");
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const sendResetLink = async (email: string) => {
	// eslint-disable-next-line no-useless-catch
	try {
		const response = await axios.post(
			`${BASE_URL}/api/services/Platform/Account/SendAutoLoginWithReset`,
			{
				emailAddress: email,
				autoDetectTenancy: true,
			}
		);
		return response.data.result.detectedTenancies?.[0]?.id;
	} catch (error) {
		throw error;
	}
};

export const authenticateByCode = async (
	code: string,
	emailAddress: string,
	tenantId: number
) => {
	// eslint-disable-next-line no-useless-catch
	try {
		const config = {
			method: "post",
			url: `${BASE_URL}/api/TokenAuth/AuthenticateByCode`,
			headers: {
				"Abp.Tenantid": tenantId,
			},
			data: { code, emailAddress },
		};

		const response = await axios.request(config);

		const accessToken = response.data.result.accessToken;

		localStorage.setItem("accessToken", accessToken);

		return accessToken;
	} catch (error) {
		throw error;
	}
};
