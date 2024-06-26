export const getContactPhotoUrl = ({
	publicId = "",
	tenantId = 0,
	isThumbnail = true,
}: {
	publicId: string;
	tenantId: number;
	isThumbnail: boolean;
}): string => {
	if (publicId) {
		const actionName = isThumbnail ? "thumbnail" : "photo";

		return (
			process.env.NEXT_PUBLIC_API_BASE_URL +
			"/api/contactPhoto/" +
			actionName +
			"/" +
			tenantId +
			"/" +
			publicId
		);
	}
	return "/images/no-photo.png";
};
