import React from "react";

interface ISelect {
	name: string;
	value: string;
}
const arrowIcon = (
	<svg
		width='16'
		height='16'
		viewBox='0 0 16 16'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M2.95339 5.67461C3.1331 5.46495 3.44875 5.44067 3.65841 5.62038L7.99968 9.34147L12.341 5.62038C12.5506 5.44067 12.8663 5.46495 13.046 5.67461C13.2257 5.88428 13.2014 6.19993 12.9917 6.37964L8.32508 10.3796C8.13783 10.5401 7.86153 10.5401 7.67429 10.3796L3.00762 6.37964C2.79796 6.19993 2.77368 5.88428 2.95339 5.67461Z'
			fill='currentColor'
		/>
	</svg>
);

export const Select = ({
	options,
	name,
	onChange,
	value,
}: {
	options: ISelect[];
	name: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	value: string | number | readonly string[] | undefined;
}) => {
	return (
		<div className='relative z-20'>
			<select
				name={name}
				onChange={onChange}
				id='select'
				value={value}
				className='relative h-12 w-full appearance-none rounded-md border border-stroke bg-gray-1 pl-4 pr-10 text-dark outline-none ring-offset-1 duration-300 focus:shadow-input focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-white/5 dark:text-white dark:focus:border-transparent'
			>
				{options.map((item) => {
					return (
						<option value={item.value} className='dark:bg-dark' key={item.name}>
							{item.name}
						</option>
					);
				})}
			</select>
			<span className='absolute right-4 top-1/2 z-10 -translate-y-1/2'>
				{arrowIcon}
			</span>
		</div>
	);
};
