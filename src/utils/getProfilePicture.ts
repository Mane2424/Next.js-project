export const getProfilePicture = (id: string, tenantId: number) => {
	if (!id) {
		return null;
	}
	return (
		process.env.NEXT_PUBLIC_API_BASE_URL +
		"/api/Profile/Picture/" +
		(tenantId || 0) +
		"/" +
		id
	);
};
