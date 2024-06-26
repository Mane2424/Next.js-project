"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Common/Dashboard/Sidebar";
import Header from "@/components/Common/Dashboard/Header";
import { userSidebarData } from "@/staticData/sidebarData";
import { useActions } from "@/app/hooks/useActions";
import { MySubscriptions } from "@/components/subscriptions/MySubscriptions";
import CustomModal from "@/components/Common/Modals/CustomModal";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	const [openSidebar, setOpenSidebar] = useState(false);
	const [openSubscriptions, setOpenSubscriptions] = useState<boolean>(false);
	const { getUser } = useActions();

	useEffect(() => {
		getUser();
	}, []);
	return (
		<>
			<main className='min-h-screen bg-gray-2 dark:bg-[#151F34]'>
				<aside
					className={`fixed left-0 top-0 z-[999] h-screen w-[350px] overflow-y-auto bg-white duration-300 dark:bg-gray-dark ${
						openSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
					}`}
				>
					<Sidebar
						sidebarData={userSidebarData}
						setOpenSubscriptions={setOpenSubscriptions}
					/>
				</aside>
				<div
					onClick={() => setOpenSidebar(false)}
					className={`fixed inset-0 z-[99] h-screen w-full bg-dark/80 lg:hidden ${
						openSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
					}`}
				></div>
				<section className='lg:ml-[350px]'>
					<Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
					<div className=''>{children}</div>
				</section>
				{openSubscriptions && (
					<CustomModal
						title=''
						onClose={() => setOpenSubscriptions(false)}
						className='!rounded-3xl'
						content={<MySubscriptions />}
					/>
				)}
			</main>
		</>
	);
};

export default AdminLayout;
