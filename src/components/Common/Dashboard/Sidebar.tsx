"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AffiliateCode } from "./AffiliateCode";

export default function Sidebar({
	sidebarData,
	sidebarRef,
	setOpenSubscriptions,
}: any) {
	const pathname = usePathname();
	return (
		<>
			<div
				ref={sidebarRef}
				className='h-full border-r border-stroke px-6 py-10 dark:border-stroke-dark'
			>
				<Link href='/user' className='mb-10 inline-block'>
					<div className="h-[55px] w-[180px] bg-[url('/images/Logo.svg')] bg-cover dark:bg-[url('/images/Logo-dark.svg')]" />
				</Link>
				<AffiliateCode />
				<div className='mb-6'>
					<ul className='space-y-2'>
						{sidebarData &&
							sidebarData?.map((item: any, key: number) => (
								<li key={key}>
									{item?.path === "/app/subscriptions" ? (
										<div
											className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3.5 py-4 !text-[14px] font-normal duration-300 ${
												pathname === `${item.path}`
													? "bg-primary bg-opacity-10 text-primary dark:bg-white dark:bg-opacity-10 dark:text-white"
													: "text-dark hover:bg-primary hover:bg-opacity-10 hover:text-primary dark:text-gray-5 dark:hover:bg-white dark:hover:bg-opacity-10 dark:hover:text-white"
											}`}
											onClick={() => {
												setOpenSubscriptions(true);
											}}
										>
											<span className='h-[24px] w-[24px]'>{item?.icon}</span>
											{item?.title}
										</div>
									) : (
										<Link
											href={`${item?.path}`}
											className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-4 !text-[14px] font-normal duration-300 ${
												pathname === `${item.path}`
													? "bg-primary bg-opacity-10 text-primary dark:bg-white dark:bg-opacity-10 dark:text-white"
													: "text-dark hover:bg-primary hover:bg-opacity-10 hover:text-primary dark:text-gray-5 dark:hover:bg-white dark:hover:bg-opacity-10 dark:hover:text-white"
											}`}
										>
											<span className='h-[24px] w-[24px]'>{item?.icon}</span>
											{item?.title}

											{item?.comingSoon && (
												<span
													className={`rounded-lg px-1.5 text-sm  ${
														pathname == `${item.path}`
															? "bg-white/[.08] text-white"
															: "bg-primary/[.08] text-primary"
													}`}
												>
													{" "}
													Soon
												</span>
											)}
										</Link>
									)}
								</li>
							))}
					</ul>
				</div>
			</div>
		</>
	);
}
