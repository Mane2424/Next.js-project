import ContentLoader from "@/components/Common/ContentLoader";
import { DataStats } from "@/staticData/statsData";

export default function DataStatsCard({
	data,
	loading,
	index,
}: {
	data: DataStats;
	loading: boolean;
	index: number;
}) {
	const { icon, value, content, color, isIncrease, percents } = data;

	return (
		<div className='rounded-10 bg-white pb-7 pl-5.5 pr-7.5 pt-5 shadow-1 dark:bg-gray-dark'>
			{loading ? (
				<ContentLoader />
			) : (
				<div className='flex items-start gap-8'>
					<div
						className='flex aspect-square w-[58px] items-center justify-center rounded-full text-white'
						style={{ background: color }}
					>
						{icon}
					</div>
					<div className='mt-4 w-4/5'>
						<p className='text-[23px] font-bold text-dark dark:text-gray-4'>
							{content}
						</p>
						<div className='mt-7 flex justify-between'>
							<h3 className='text-xl font-semibold text-dark dark:text-white'>
								{index === 0 && value ? "$" + value : value}
							</h3>

							<div className='flex items-center justify-between'>
								<p
									className={`flex items-center gap-1.5 text-xl font-semibold ${
										isIncrease ? "text-[#00BC55]" : "text-red"
									}`}
								>
									{percents}
									<span className={`${isIncrease ? "" : "rotate-180"}`}>
										<svg
											width='10'
											height='10'
											viewBox='0 0 10 10'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M4.35716 2.3925L0.908974 5.745L5.0443e-07 4.86125L5 -5.1656e-07L10 4.86125L9.09103 5.745L5.64284 2.3925L5.64284 10L4.35716 10L4.35716 2.3925Z'
												fill='currentColor'
											/>
										</svg>
									</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
