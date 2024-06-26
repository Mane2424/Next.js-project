import { useAppSelector } from "@/redux";
import { userAccount } from "@/redux/selectors";
import { getContactPhotoUrl } from "@/utils/getContactPhotoUrl";
import "@/styles/leadsPage.scss";
import React from "react";
interface Data {
	PhotoPublicId: string;
}
interface Props {
	data: Data;
}
const PhotoTemplate: React.FC<Props> = ({ data }) => {
	const account = useAppSelector(userAccount.account);
	const photoData = {
		publicId: data.PhotoPublicId,
		tenantId: account?.data?.result?.tenant.id,
		isThumbnail: true,
	};
	return (
		<div
			style={{
				backgroundImage: `url(${getContactPhotoUrl(photoData)})`,
			}}
			className='img-circle'
		></div>
	);
};
export default PhotoTemplate;
