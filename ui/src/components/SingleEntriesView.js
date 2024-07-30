import React, { useState, useEffect } from "react";
import SessionMenu from "./SessionMenu";
import SpecificEntry from "./SpecificEntry";
import SubmittedEntry from "./SubmittedEntry";

const SingleEntriesView = () => {
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
		addEntry();
	};

	return (
		<div>
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
		</div>
	);
};

export default SingleEntriesView;
