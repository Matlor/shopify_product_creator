import React, { useState, useEffect } from "react";
import SessionMenu from "./components/SessionMenu";
import SpecificEntry from "./components/SpecificEntry";
import SubmittedEntry from "./components/SubmittedEntry";
import "./index.css"; // Ensure this is present

const App = () => {
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

	console.log(entries, "entries");
	//const [selectedPictures, setSelectedPictures] = useState([]);

	// Ensure there is always one current entry
	/* useEffect(() => {
		if (entries.filter((entry) => !entry.submitted).length === 0) {
			addEntry();
		}
	}, [entries]); */

	// -------- Adds a new entry--------
	const addEntry = () => {
		setEntries([...entries, { specificPrice: 0, pictureSelection: "", submitted: false }]);
	};

	// -------- Reads from 1, makes copy, refreshes all to include it--------
	const updateEntry = (index, entrySettings) => {
		console.log(entrySettings, "entrySettings in update Entry func");
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

	return (
		<div className="container mx-auto p-8">
			<SessionMenu settings={settings} setSettings={setSettings} />
			<div className="mt-6">
				<h2 className="text-2xl font-bold mb-4">Current Entry</h2>
				{entries
					.filter((entry) => !entry.submitted)
					.map((entry, index) => (
						<SpecificEntry
							key={index}
							settings={settings}
							entrySettings={entry}
							setEntrySettings={() => updateEntry(index, entry)}
							submitEntry={() => submitEntry(index)}
						/>
					))}
			</div>
			<div className="mt-6">
				<h2 className="text-2xl font-bold mb-4">Submitted Entries</h2>
				{entries
					.filter((entry) => entry.submitted)
					.map((entry, index) => (
						<SubmittedEntry key={index} entrySettings={entry} />
					))}
			</div>
		</div>
	);
};

export default App;
