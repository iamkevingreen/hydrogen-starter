import React from 'react';

// import { CustomModule } from '~/components/modules/CustomModule'

const COMPONENTS = {
	// 'module.customModule': CustomModule
};

const PageComponentList = ({components = [], componentProps = {}}) => {
	const componentRows = components?.map((component, index) => {
		const Component = COMPONENTS[component._type];

		if (!Component)
			return (
				<div key={component._key} className="p-8">
					<div className='p-2 border border-solid bg-magenta'>
						missing - {component._type}
					</div>
				</div>
			);

		return (
			<Component
				index={index}
				key={component._key}
				{...component}
				{...componentProps}
			/>
		);
	});

	return <>{componentRows}</>
};

export default PageComponentList;
