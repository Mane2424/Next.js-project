import React from "react";

const ContentLoader = () => {
	return (
		<div className='flex h-full w-full items-center justify-center bg-white dark:bg-gray-dark'>
			<div className='h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent'></div>
		</div>
	);
};

export default ContentLoader;
