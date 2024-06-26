import axios from "axios";

const prefixes = [";base64,77u/", ";base64,"];

const getBase64 = (data: string): string => {
	let prefixIndex = 0;
	const prefix =
		(data && prefixes.find((p) => (prefixIndex = data.indexOf(p)) !== -1)) ||
		"";
	return data && data.slice(prefixIndex + prefix.length);
};

const downloadFileBlob = (url: string, callback: any) => {
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) callback(xhr.response);
	};
	xhr.open("GET", url);
	xhr.responseType = "blob";
	xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
	xhr.send();
};

const getPdfData = (pdfLink: string, setPdfFile: any) => {
	return downloadFileBlob(pdfLink, (blob: any) => {
		const reader = new FileReader();
		reader.addEventListener("loadend", () => {
			setPdfFile(getBase64(reader.result as string));
		});
		reader.readAsDataURL(blob);
	});
};

export const generatePdf = async (
	id: number | undefined,
	payerOrganizationUnitId: number | undefined,
	setPdfFile: any
) => {
	let url = "/api/services/CRM/UserInvoice/GeneratePdf?";
	if (id === null) throw new Error("The parameter 'id' cannot be null.");
	else if (id !== undefined) url += "id=" + encodeURIComponent("" + id) + "&";
	if (payerOrganizationUnitId === null)
		throw new Error("The parameter 'payerOrganizationUnitId' cannot be null.");
	else if (payerOrganizationUnitId !== undefined)
		url +=
			"payerOrganizationUnitId=" +
			encodeURIComponent("" + payerOrganizationUnitId) +
			"&";
	url = url.replace(/[?&]$/, "");

	const apiClient = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
		responseType: "blob",
		headers: {
			Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
			["Authorization"]: "Bearer " + localStorage.getItem("accessToken"),
		},
	});
	const response = await apiClient.get(url);
	response?.data
		.text()
		.then((res: any) => {
			const resultData = res === "" ? null : JSON.parse(res);
			getPdfData(resultData.result, setPdfFile);
			return resultData;
		})
		.catch(() => {
			//
		});
};
