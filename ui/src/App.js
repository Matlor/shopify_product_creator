import React, { useState } from "react";
import SingleEntriesView from "./components/SingleEntriesView";
import ManyEntriesView from "./components/ManyEntriesView";

import "./index.css";

const App = () => {
	const [selectedStore, setSelectedStore] = useState(null);
	const [isStarted, setIsStarted] = useState(false);
	const [activeView, setActiveView] = useState("single");

	const selectStore = (store) => {
		setSelectedStore(store);
	};

	const startSession = async () => {
		try {
			await window.electron.setStore(selectedStore);
			setIsStarted(true);
		} catch (error) {
			console.error("Error setting store:", error);
			// Handle the error appropriately, maybe show an error message to the user
		}
	};

	(async () => {
		console.log(await window.electron.runTest(), "run test");
		console.log(await window.electron.getProduct(9669873041741), "get product etage");
		console.log(await window.electron.getProduct(8454488621268), "get product mt");
	})();

	if (!isStarted) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="flex flex-col items-center">
					<h2 className="text-2xl font-bold mb-4">Select a Store</h2>
					<div className="flex space-x-4 mb-4">
						<button
							onClick={() => selectStore("etage")}
							className={`py-2 px-4 rounded ${
								selectedStore === "etage"
									? "bg-green-500 text-white"
									: "bg-gray-200"
							}`}
						>
							Étage
						</button>
						<button
							onClick={() => selectStore("michelleTamar")}
							className={`py-2 px-4 rounded ${
								selectedStore === "michelleTamar"
									? "bg-pink-500 text-white"
									: "bg-gray-200"
							}`}
						>
							Michelle Tamar
						</button>
					</div>
					{selectedStore && (
						<div className="flex items-center">
							<p className="mr-4">
								Selected: {selectedStore === "etage" ? "Étage" : "Michelle Tamar"}
							</p>
							<button
								onClick={startSession}
								className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
							>
								Start
							</button>
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<div className="container mx-auto p-8">
				<h1 className="text-2xl font-bold mb-4">
					{selectedStore === "etage" ? "Étage" : "Michelle Tamar"}
				</h1>
				<div className="mb-6">
					<button
						onClick={() => setActiveView("single")}
						className={`py-2 px-4 rounded mr-2 ${
							activeView === "single" ? "bg-blue-500 text-white" : "bg-gray-200"
						}`}
					>
						Single Entries
					</button>
					<button
						onClick={() => setActiveView("many")}
						className={`py-2 px-4 rounded ${
							activeView === "many" ? "bg-blue-500 text-white" : "bg-gray-200"
						}`}
					>
						Many Entries
					</button>
				</div>
				{activeView === "single" && <SingleEntriesView store={selectedStore} />}
				{activeView === "many" && <ManyEntriesView store={selectedStore} />}
			</div>
		</div>
	);
};

export default App;
