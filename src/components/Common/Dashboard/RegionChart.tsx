import Map, {
	Label,
	Layer,
	Legend,
	Source,
	Tooltip,
	Size,
} from "devextreme-react/vector-map";
import { canadaMapData, usaMapData, worldMapData } from "@/utils/mapData";
import { useState } from "react";
import { useAppSelector } from "@/redux";
import { dashboard } from "@/redux/selectors";
import ContentLoader from "../ContentLoader";

type Country = "USA" | "Canada" | "World";

const colorGroups = [1, 100, 500, 1000, 5000, 25000, 50000];
const mapBounds: {
	World: number[];
	USA: number[];
	Canada: number[];
} = {
	World: [-180, 85, 180, -60],
	USA: [-143, 62, -60, 5],
	Canada: [-128, 90, -60, 20],
};

const { format } = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 0,
});

function customizeLegendText(arg: any) {
	return `${format(arg.start)} to ${format(arg.end)}`;
}

const RegionChart = () => {
	const [region, setRegion] = useState<"USA" | "Canada" | "World">("USA");
	const [regions] = useState<Country[]>(["USA", "Canada", "World"]);
	const [mapData, setMapData] = useState<any>(usaMapData);
	const contactsByRegion = useAppSelector(dashboard.contactsByRegion);
	const [openModal, setOpenModal] = useState(false);
	const data = contactsByRegion?.data?.reduce(
		(result, item) => ({
			...result,
			[item.countryId]: item.count,
			[item.stateId ?? ""]: item.count,
		}),
		{}
	) as any;

	const customizeLayer = (elements: any) => {
		elements.forEach((element: any) => {
			const countryContacts = data?.[element.attribute("postal")];
			element.attribute("contacts", countryContacts || 0);
		});
	};

	const TooltipTemplate = (info: any) => {
		const contactsCount = data?.[info.attribute("postal")];
		const name = info.attribute("name");

		return (
			<div>
				<p className='text-[18px] font-semibold'>{name}</p>
				<p>
					{contactsCount ? `${contactsCount} contacts` : "No statistical data"}
				</p>
			</div>
		);
	};

	if (!contactsByRegion) return <></>;

	return (
		<>
			{contactsByRegion.isLoading ? (
				<ContentLoader />
			) : (
				<div className='min-h-[570px] rounded-md bg-white p-4 shadow-md dark:bg-gray-dark'>
					<div className='flex w-full justify-between text-dark dark:text-white'>
						<h2 className='text-[22px] font-bold'>Map</h2>
						<div className='relative w-[190px]'>
							<button
								className='border-gray-3000 flex w-full items-center justify-between rounded-md border bg-transparent px-4 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
								aria-haspopup='true'
								aria-expanded='true'
								onClick={() => setOpenModal(!openModal)}
							>
								<span className='truncate text-dark dark:text-white'>
									{region}
								</span>
								<svg
									className='-mr-1 ml-2 h-4 w-4'
									fill='currentColor'
									viewBox='0 0 20 20'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										fillRule='evenodd'
										d='M7.293 8.293a1 1 0 011.414 0L10 9.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z'
										clipRule='evenodd'
									></path>
								</svg>
							</button>
							{openModal && (
								<div className='absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md border border-gray-200 bg-white shadow-lg dark:bg-gray-dark dark:text-white'>
									<ul className='py-1'>
										{regions.map((option) => (
											<li key={option}>
												<button
													className='block px-4 py-2 text-sm text-dark dark:text-white'
													type='button'
													onClick={() => {
														setRegion(option);
														setMapData(
															option === "USA"
																? { ...usaMapData }
																: option === "Canada"
																	? { ...canadaMapData }
																	: { ...worldMapData }
														);
														setOpenModal(false);
													}}
												>
													{option}
												</button>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
					<Map
						style={{ width: "90%" }}
						bounds={mapBounds[region]}
						background={{ color: "transparent", borderColor: "transparent" }}
						zoomFactor={region === "USA" ? 1.8 : 1}
					>
						<Size height={500} />

						<Layer
							name='areas'
							dataSource={mapData}
							colorGroups={colorGroups}
							colorGroupingField='contacts'
							customize={customizeLayer}
						>
							<Label dataField='postal' enabled={true} />
						</Layer>

						<Legend customizeText={customizeLegendText}>
							<Source layer='areas' grouping='color' />
						</Legend>

						<Tooltip enabled={true} contentRender={TooltipTemplate} />
					</Map>
				</div>
			)}
		</>
	);
};

export default RegionChart;
