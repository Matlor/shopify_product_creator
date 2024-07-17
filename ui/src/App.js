import React, { useState, useEffect } from "react";
import SessionMenu from "./components/SessionMenu";
import SpecificEntry from "./components/SpecificEntry";
import SubmittedEntry from "./components/SubmittedEntry";
import NavigationTab from "./components/NavigationTab";
import PictureGallery from "./components/PictureGallery";

import "./index.css"; // Ensure this is present

//const test = require("../../src/debugging");

const App = () => {
	// --------------- Testing only--------------------------
	/* console.log(window.electronAPI);
	const fetchProductDetails = async (productId) => {
		const prod = await window.electronAPI.getProduct(productId);
		return prod;
	};

	useEffect(async () => {
		console.log(window.electronAPI, "electron api");

		console.log(await window.electronAPI.getFile(), "file");
		console.log(await fetchProductDetails("9113625985357"));
	}, []); */

	// -------------------------------------------

	const [settings, setSettings] = useState({
		publish: "online",
		status: "active",
		priceMode: "each",
		autoPrice: 0,
		numPictures: 1,
		printLabelOnCreation: false,
	});

	const [entries, setEntries] = useState([
		{ specificPrice: 0, pictureSelection: "", submitted: false },
	]);
	const [activeTab, setActiveTab] = useState(1); // Manage active tab index

	// Ensure there is always one current entry
	useEffect(() => {
		if (entries.filter((entry) => !entry.submitted).length === 0) {
			addEntry();
		}
	}, [entries]);

	const addEntry = () => {
		setEntries([...entries, { specificPrice: 0, pictureSelection: "", submitted: false }]);
	};

	const updateEntry = (index, entrySettings) => {
		const newEntries = [...entries];
		newEntries[index] = entrySettings;
		setEntries(newEntries);
	};

	const submitEntry = (index) => {
		const newEntries = [...entries];
		newEntries[index].submitted = true;
		setEntries(newEntries);
		addEntry(); // Automatically add a new entry when one is submitted
	};

	const tabs = ["Single Entries", "Many Entries"];

	return (
		<div className="container mx-auto p-8">
			<SessionMenu settings={settings} setSettings={setSettings} />
			<NavigationTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

			{activeTab === 0 && (
				<div className="mt-6">
					<h2 className="text-2xl font-bold mb-4">Current Entry</h2>
					{entries
						.filter((entry) => !entry.submitted)
						.map((entry, index) => (
							<SpecificEntry
								key={index}
								settings={settings}
								entrySettings={entry}
								setEntrySettings={(newSettings) => updateEntry(index, newSettings)}
								submitEntry={() => submitEntry(index)}
							/>
						))}
					<div className="mt-6">
						<h2 className="text-2xl font-bold mb-4">Submitted Entries</h2>
						{entries
							.filter((entry) => entry.submitted)
							.map((entry, index) => (
								<SubmittedEntry key={index} entrySettings={entry} />
							))}
					</div>
				</div>
			)}

			{activeTab === 1 && (
				<div className="mt-6">
					<PictureGallery />
				</div>
			)}
		</div>
	);
};

export default App;
