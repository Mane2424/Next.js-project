import {
	IAffiliatePayoutSettingInfo,
	IAffiliatePayoutSettingInput,
} from "@/types/payoutSettings";
import axios from "axios";
import moment from "moment";

export const getAvailablePayoutTypes = async (
	setTypes: React.Dispatch<
		React.SetStateAction<{ name: string; value: string }[]>
	>
) => {
	const blobApi = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
		responseType: "blob",
		headers: {
			Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
			["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
		},
	});
	const response = await blobApi.get(
		"/api/services/CRM/AffiliatePayoutSetting/GetAvailablePayoutTypes"
	);
	response?.data
		.text()
		.then((res: any) => {
			const resultData = res === "" ? null : JSON.parse(res);
			if (resultData && resultData.result.length) {
				const newData = resultData.result.map((elem: string) => ({
					name: elem.replace(/([A-Z])/g, " $1").trim(),
					value: elem,
				}));
				setTypes(newData);
			}
		})
		.catch(() => {
			setTypes([]);
		});
};
export const getPaymentProxy = async (
	setPaymentSetting: React.Dispatch<
		React.SetStateAction<IAffiliatePayoutSettingInfo | undefined>
	>,
	setSettings:
		| React.Dispatch<React.SetStateAction<IAffiliatePayoutSettingInfo[]>>
		| undefined
) => {
	const blobApi = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
		responseType: "blob",
		headers: {
			Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
			["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
		},
	});
	const response = await blobApi.get(
		"/api/services/CRM/AffiliatePayoutSetting/GetAll"
	);
	response?.data
		.text()
		.then((res: any) => {
			const resultData = res === "" ? null : JSON.parse(res);
			if (resultData.result && resultData.result.length)
				if (setSettings) {
					setSettings(resultData.result);
				}
			resultData.result.some((setting: IAffiliatePayoutSettingInfo) => {
				if (setting.isDefault) setPaymentSetting(setting);
			});
		})
		.catch(() => {
			setPaymentSetting(undefined);
		});
};
export const connectStripeAccount = async () => {
	try {
		const blobApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});
		const response = await blobApi.post(
			"/api/services/CRM/AffiliatePayoutSetting/ConnectStripeAccount"
		);
		response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (resultData && resultData.result.length) {
					window.location.href = resultData.result;
					return resultData.result;
				}
			})
			.catch(() => {
				return null;
			});
	} catch {
		() => {
			return null;
		};
	}
};
export const payoutCreateOrUpdate = async (
	body: IAffiliatePayoutSettingInput | undefined
) => {
	const payoutUpdateApi = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
		responseType: "blob",
		headers: {
			ContentType:
				"application/json;odata.metadata=minimal;odata.streaming=true",
			["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
		},
	});
	try {
		const response = await payoutUpdateApi.post(
			"/api/services/CRM/AffiliatePayoutSetting/CreateOrUpdate",
			body
		);
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve) => {
			const res = await response?.data.text();
			const resultData = res === "" ? null : JSON.parse(res);
			return resolve(resultData);
		});
	} catch (err) {
		return null;
	}
};
export const getLedger = async (startDate: any, setLedger: any) => {
	try {
		const blobApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});
		const response = await blobApi.get(
			`/api/services/CRM/UserCommission/GetLedger?${
				"startDate=" +
				encodeURIComponent(startDate ? "" + startDate.toISOString() : "") +
				"&"
			}`
		);
		response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (resultData && resultData.result) {
					resultData.result.entries.forEach((elem: any) => {
						elem.date = elem.date ? moment(elem.date.toString()) : undefined;
						elem.startDate = elem.startDate
							? moment(elem.startDate.toString())
							: undefined;
						elem.endDate = elem.endDate
							? moment(elem.endDate.toString())
							: undefined;
					});
					setLedger(resultData.result);
				}
			})
			.catch(() => {
				return null;
			});
	} catch {
		() => {
			return null;
		};
	}
};
export const getSubscriptionHistory = async (setSubscriptionHistory: any) => {
	try {
		const blobApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});
		const response = await blobApi.get(
			`/api/services/CRM/UserSubscription/GetSubscriptionHistory`
		);
		response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (resultData && resultData.result) {
					setSubscriptionHistory(resultData.result);
				}
			})
			.catch(() => {
				return null;
			});
	} catch {
		() => {
			return null;
		};
	}
};
export const getPayments = async (setPayments?: any) => {
	try {
		const blobApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});

		const response = await blobApi.get(
			"/api/services/CRM/UserPayment/GetPayments"
		);
		response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (resultData && resultData.result) {
					setPayments(resultData.result);
				}
			})
			.catch(() => {
				return null;
			});
	} catch {
		() => {
			return null;
		};
	}
};
export const userSubscriptionCancel = async (body: any, onClose: any) => {
	try {
		const blobApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});

		const response = await blobApi.post(
			"/api/services/CRM/UserSubscription/Cancel",
			body
		);
		if (response?.data) {
			onClose();
		}
	} catch {
		() => {
			return null;
		};
	}
};
export const getPaymentMethods = async (setPaymentMethod?: any) => {
	try {
		const blobApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});

		const response = await blobApi.get(
			"api/services/CRM/UserPayment/GetPaymentMethods"
		);
		response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (resultData && resultData.result) {
					setPaymentMethod(resultData.result);
				}
			})
			.catch(() => {
				return null;
			});
	} catch {
		() => {
			return null;
		};
	}
};
export const getStages = async () => {
	try {
		const blobApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});

		const response = await blobApi.get(
			"/api/services/CRM/Pipeline/GetPipelineDefinitions"
		);
		const filter = response?.data?.result?.filter(
			(elem: any) => elem?.id === 3906
		);
		return filter[0]?.stages;
	} catch {
		() => {
			return null;
		};
	}
};
export const getCountries = async () => {
	try {
		const blobApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});

		const response = await blobApi.get(
			"/api/services/CRM/Country/GetCountries"
		);
		return response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (resultData && resultData.result) {
					const newCountry = resultData.result.map((elem: any) => ({
						id: elem.code,
						name: elem.name,
					}));
					return newCountry;
				}
			})
			.catch(() => {
				return null;
			});
	} catch {
		() => {
			return null;
		};
	}
};
export const getStates = async (setStages?: any, code?: any) => {
	try {
		const blobApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});

		const response = await blobApi.get(
			`/api/services/CRM/Country/GetCountryStates?code=${encodeURIComponent(
				"" + code
			)}&`
		);
		response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (resultData && resultData.result) {
					setStages(resultData.result);
				}
			})
			.catch(() => {
				return null;
			});
	} catch {
		() => {
			return null;
		};
	}
};
export const getStars = async () => {
	try {
		const blobApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});

		const response = await blobApi.get(`/api/services/CRM/Dictionary/GetStars`);
		return response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (resultData && resultData.result) {
					return resultData.result;
				}
			})
			.catch(() => {
				return null;
			});
	} catch {
		() => {
			return null;
		};
	}
};
export const getTags = async () => {
	try {
		const blobApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});

		const response = await blobApi.get(`/api/services/CRM/Dictionary/GetTags`);
		return response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (resultData && resultData.result) {
					return resultData.result;
				}
			})
			.catch(() => {
				return null;
			});
	} catch {
		() => {
			return null;
		};
	}
};
export const getLists = async () => {
	try {
		const blobApi = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			responseType: "blob",
			headers: {
				Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
				["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
			},
		});
		const response = await blobApi.get(`/api/services/CRM/Dictionary/GetLists`);
		return response?.data
			.text()
			.then((res: any) => {
				const resultData = res === "" ? null : JSON.parse(res);
				if (resultData && resultData.result) {
					return resultData.result;
				}
			})
			.catch(() => {
				return null;
			});
	} catch {
		() => {
			return null;
		};
	}
};
