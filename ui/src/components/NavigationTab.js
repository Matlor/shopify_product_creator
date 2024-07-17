import React from "react";

const NavigationTab = ({ tabs, activeTab, setActiveTab }) => {
	return (
		<div className="mb-6">
			<div className="flex space-x-4">
				{tabs.map((tab, index) => (
					<button
						key={index}
						onClick={() => setActiveTab(index)}
						className={`py-2 px-4 rounded ${
							activeTab === index ? "bg-blue-500 text-white" : "bg-gray-200"
						}`}
					>
						{tab}
					</button>
				))}
			</div>
		</div>
	);
};

export default NavigationTab;
