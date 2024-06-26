import React from "react";

const SubmittedEntry = ({ entrySettings }) => {
	console.log(entrySettings);
	return (
		<div className="p-4 bg-gray-200 rounded-md shadow-md my-4">
			<h2 className="text-lg font-semibold mb-2">Submitted Entry</h2>
			<div>
				<span className="font-semibold">Specific Price:</span> {entrySettings.specificPrice}
			</div>
			<div>
				<span className="font-semibold">Picture Selection:</span>{" "}
				{entrySettings.pictureSelection}
			</div>
			<button
				onClick={() => console.log("Printing label...")}
				className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md mt-4"
			>
				Print Label
			</button>
		</div>
	);
};

export default SubmittedEntry;
