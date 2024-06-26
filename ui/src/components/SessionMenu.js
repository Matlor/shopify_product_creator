import React from "react";

const SessionMenu = ({ settings, setSettings }) => {
	const handleRadioChange = (e) => {
		const { name, value } = e.target;
		setSettings((prevSettings) => ({
			...prevSettings,
			[name]: value,
		}));
	};

	const handleCheckboxChange = (e) => {
		const { name, checked } = e.target;
		setSettings((prevSettings) => ({
			...prevSettings,
			[name]: checked,
		}));
	};

	return (
		<div className="p-4 bg-gray-100 rounded-md shadow-md mb-6">
			<h2 className="text-xl font-bold mb-4">Session Menu</h2>
			<div className="flex flex-wrap items-start">
				<div className="w-full md:w-1/2 p-2 flex flex-col md:flex-row border-r-2 border-gray-300 pr-2">
					<div className="md:w-1/2 mb-4 md:mb-0">
						<label className="block mb-2 font-semibold text-gray-600">Publish:</label>
						<div>
							<label className="inline-flex items-center">
								<input
									type="radio"
									name="publish"
									value="online"
									checked={settings.publish === "online"}
									onChange={handleRadioChange}
									className="form-radio text-gray-600"
								/>
								<span className="ml-2 text-gray-600">Online</span>
							</label>
							<label className="inline-flex items-center ml-4">
								<input
									type="radio"
									name="publish"
									value="POS"
									checked={settings.publish === "POS"}
									onChange={handleRadioChange}
									className="form-radio text-gray-600"
								/>
								<span className="ml-2 text-gray-600">POS</span>
							</label>
							<label className="inline-flex items-center ml-4">
								<input
									type="radio"
									name="publish"
									value="both"
									checked={settings.publish === "both"}
									onChange={handleRadioChange}
									className="form-radio text-gray-600"
								/>
								<span className="ml-2 text-gray-600">Both</span>
							</label>
						</div>
					</div>
					<div className="md:w-1/2">
						<label className="block mb-2 font-semibold text-gray-600">Status:</label>
						<div>
							<label className="inline-flex items-center">
								<input
									type="radio"
									name="status"
									value="active"
									checked={settings.status === "active"}
									onChange={handleRadioChange}
									className="form-radio text-gray-600"
								/>
								<span className="ml-2 text-gray-600">Active</span>
							</label>
							<label className="inline-flex items-center ml-4">
								<input
									type="radio"
									name="status"
									value="inactive"
									checked={settings.status === "inactive"}
									onChange={handleRadioChange}
									className="form-radio text-gray-600"
								/>
								<span className="ml-2 text-gray-600">Inactive</span>
							</label>
						</div>
					</div>
				</div>
				<div className="w-full md:w-1/4 p-2">
					<label className="block mb-2 font-semibold">Price:</label>
					<div>
						<label className="inline-flex items-center">
							<input
								type="radio"
								name="priceMode"
								value="each"
								checked={settings.priceMode === "each"}
								onChange={handleRadioChange}
								className="form-radio"
							/>
							<span className="ml-2">Each</span>
						</label>
						<label className="inline-flex items-center ml-4">
							<input
								type="radio"
								name="priceMode"
								value="auto"
								checked={settings.priceMode === "auto"}
								onChange={handleRadioChange}
								className="form-radio"
							/>
							<span className="ml-2">Auto</span>
						</label>
						<label className="inline-flex items-center ml-4">
							<input
								type="radio"
								name="priceMode"
								value="later"
								checked={settings.priceMode === "later"}
								onChange={handleRadioChange}
								className="form-radio"
							/>
							<span className="ml-2">Later</span>
						</label>
					</div>
					{settings.priceMode === "auto" && (
						<div className="mt-2">
							<label className="block mb-2 font-semibold">Auto Price:</label>
							<input
								type="number"
								name="autoPrice"
								value={settings.autoPrice}
								onChange={handleRadioChange}
								className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
							/>
						</div>
					)}
				</div>
				<div className="w-full md:w-1/4 p-2">
					<label className="block mb-2 font-semibold">Number of Pictures:</label>
					<input
						type="number"
						name="numPictures"
						value={settings.numPictures}
						onChange={handleRadioChange}
						className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
					/>
				</div>
				<div className="w-full md:w-1/4 p-2">
					<label className="inline-flex items-center">
						<input
							type="checkbox"
							name="printLabelOnCreation"
							checked={settings.printLabelOnCreation}
							onChange={handleCheckboxChange}
							className="form-checkbox"
						/>
						<span className="ml-2">Print Label on Entry Creation</span>
					</label>
				</div>
			</div>
		</div>
	);
};

export default SessionMenu;
