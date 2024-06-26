import AccountButton from "./AccountButton";
import ThemeToggler from "./ThemeToggler";
import { useState } from "react";
import { useAppSelector } from "@/redux";
import { userAccount } from "@/redux/selectors";
import { Drawer } from "../../Drawer/Drawer";
import { ChangePassword } from "../../ChangePassword/ChangePassword";
import CustomModal from "../../Modals/CustomModal";
import { ProfilePhoto } from "@/components/Header/ProfilePhoto";
import { MySettings } from "@/components/Header/MySettings";
import { getProfilePicture } from "@/utils/getProfilePicture";
import { LoginAttempts } from "@/components/Header/LoginAttempts";

export default function Header({ openSidebar, setOpenSidebar }: any) {
	const account = useAppSelector(userAccount.account);
	const [openedDrawer, setOpenedDrawer] = useState<string | undefined>(
		undefined
	);
	const [isOpen, setIsOpen] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const toggleDrawer = (title: string | undefined) => {
		if (title === "Change Profile Photo") {
			setOpenModal(true);
		} else {
			setOpenedDrawer(title);
			setIsOpen(!isOpen);
		}
	};
	const closeDrawer = () => {
		setIsOpen(false);
		setOpenedDrawer(undefined);
	};
	return (
		<div className='sticky top-0 z-999 flex items-center justify-between border-b border-stroke bg-white px-5 py-5 dark:border-stroke-dark dark:bg-gray-dark md:px-10'>
			<div onClick={() => setOpenSidebar(!openSidebar)} className='lg:hidden'>
				<span className='relative block h-5.5 w-5.5 cursor-pointer'>
					<span className='du-block absolute right-0 h-full w-full'>
						<span className='relative left-0 top-0 my-1 block h-0.5 w-full rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white'></span>
						<span className='relative left-0 top-0 my-1 block h-0.5 w-full rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white'></span>
						<span className='relative left-0 top-0 my-1 block h-0.5 w-full rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white'></span>
					</span>
				</span>
			</div>
			<p className='hidden whitespace-nowrap font-satoshi text-xl font-medium capitalize text-dark dark:text-white lg:block'>
				Welcome {"User"}! 👋
			</p>
			<div className='flex w-full items-center justify-end gap-4'>
				<ThemeToggler />
				<AccountButton
					user={account?.data?.user}
					toggleDrawer={toggleDrawer}
					profilePictureUrl={getProfilePicture(
						account?.data?.user?.profilePictureId,
						account?.data?.tenant?.id
					)}
				/>
			</div>
			{openModal && (
				<CustomModal
					title=''
					onClose={() => setOpenModal(false)}
					content={<ProfilePhoto onClose={() => setOpenModal(false)} />}
					hasCloseIcon={false}
					setCloseModal={setOpenModal}
				/>
			)}
			{openedDrawer === "Change Password" ? (
				<Drawer
					isOpen={isOpen}
					onClose={() => closeDrawer()}
					width={500}
					title='Change Password'
				>
					<ChangePassword onClose={() => closeDrawer()} />
				</Drawer>
			) : openedDrawer === "My Settings" ? (
				<Drawer
					isOpen={isOpen}
					onClose={() => closeDrawer()}
					width={600}
					title='My Settings'
				>
					<MySettings onClose={() => closeDrawer()} />
				</Drawer>
			) : openedDrawer === "Login Attempts" ? (
				<Drawer
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					width={"60%"}
					title='Login attempts'
				>
					<LoginAttempts />
				</Drawer>
			) : (
				<Drawer
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					width={500}
					title='Help'
				>
					<div>Help</div>
				</Drawer>
			)}
		</div>
	);
}
