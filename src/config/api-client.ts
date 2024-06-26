import axios from "axios";

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add an interceptor to include the token in requests
apiClient.interceptors.request.use(
	(config) => {
		if (typeof window !== "undefined") {
			const accessToken = localStorage.getItem("accessToken");

			if (accessToken) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				config.headers = {
					...config.headers,
					Authorization: `Bearer ${accessToken}`,
				};
			}
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (typeof window !== "undefined") {
			if (error?.response?.status === 401) {
				localStorage.removeItem("accessToken");
				window.location.href = "auth/signin";
			}
		}
		return Promise.reject(error);
	}
);

export default apiClient;
