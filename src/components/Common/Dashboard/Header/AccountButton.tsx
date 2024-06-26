/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import AccountMenu from "../../AccountMenu";

interface IAccountButton {
	user: any;
	toggleDrawer: (title: string) => void;
	profilePictureUrl: string | null;
}
export default function AccountButton({
	user,
	toggleDrawer,
	profilePictureUrl,
}: IAccountButton) {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const profilePic = profilePictureUrl
		? profilePictureUrl
		: "/images/dashboard/profile-avatar.png";
	return (
		<div className='group relative flex items-center'>
			<div className='flex items-center gap-4'>
				<img
					src={profilePic}
					alt='profile name'
					className='h-[48px] w-[48px] cursor-pointer overflow-hidden rounded-full'
					onClick={() => setOpenModal(!openModal)}
				/>
			</div>
			{openModal && (
				<div className='shadow-3 border-[.5px]border-stroke  absolute right-0 top-15 z-999 w-[280px] rounded-lg bg-white pb-2.5 pt-3.5 shadow-md duration-500  dark:bg-gray-dark'>
					<AccountMenu
						user={user}
						profilePic={profilePic}
						toggleDrawer={toggleDrawer}
						setOpenModal={setOpenModal}
					/>
				</div>
			)}
		</div>
	);
}
