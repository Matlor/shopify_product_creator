import React from "react";

const SpecificEntry = ({ settings, entrySettings, setEntrySettings, submitEntry }) => {
	const handleChange = (e) => {
		const { name, value } = e.target;
		setEntrySettings((prevSettings) => ({
			...prevSettings,
			[name]: value,
		}));
	};

	return (
		<div
			className={`p-4 ${
				entrySettings.submitted ? "bg-gray-200" : "bg-white"
			} rounded-md shadow-md my-4`}
		>
			<h2 className="text-lg font-semibold mb-2">Specific Entry</h2>
			{settings.priceMode === "each" && (
				<label className="block mb-2">
					<span className="font-semibold">Specific Price:</span>
					<input
						type="number"
						name="specificPrice"
						value={entrySettings.specificPrice}
						onChange={handleChange}
						className="block w-full mt-1 border-gray-300 rounded-md shadow-sm text-lg"
						disabled={entrySettings.submitted}
					/>
				</label>
			)}
			<label className="block mb-2">
				<span className="font-semibold">Picture Selection:</span>
				<input
					type="text"
					name="pictureSelection"
					value={entrySettings.pictureSelection}
					onChange={handleChange}
					className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
					disabled={entrySettings.submitted}
				/>
			</label>
			{!entrySettings.submitted && (
				<button
					onClick={submitEntry}
					className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md mt-4"
				>
					Submit
				</button>
			)}
		</div>
	);
};

export default SpecificEntry;
