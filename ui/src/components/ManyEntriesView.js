import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

/* 

 I THINK IN THE END THE PICTURE STATE AND THE ENTRIES SHOULD BE THE SAME THING.
 IT WOULD BE AN OBJECT WITH AN ARRAY (OR DIRECTLY) OF THE UNASSIGNED PICTURES.
 AND THEN AN OBJECT IN THERE AS WELL OF ENTRIES AND (AGAIN) THE UNASSIGNED ONES.

 THEN IT WOULD ADD ALL PICTURES TO THE UNASSIGNED. THEN ASSIGN THEM BASED ON EITHER
 INITIAL VERISON OF JSON FILE (DONE ONCE) OR IT WOULD OVERWRITE IT (IF EMPTY)

*/

const PictureGallery = () => {
	const numPicturesPerEntry = 3; // Fixed number of pictures per entry

	// State for pictures, entries, and removed pictures
	const [pictures, setPictures] = useState([]);
	const [entries, setEntries] = useState([]);
	const [removedPictures, setRemovedPictures] = useState([]);

	const [draggedPicture, setDraggedPicture] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);
	const [dragOverPosition, setDragOverPosition] = useState(null);

	// ------ SETS PICS STATE INITIALLY ------
	useEffect(() => {
		async function fetchImages() {
			const images = await window.electron.getImages();
			setPictures(images);
		}
		fetchImages();
	}, []);

	// ------ ONLY RUNS ONCE AFTER THE INITIAL RENDERING------
	useEffect(() => {
		async function fetchEntries() {
			const savedEntries = await window.electron.getEntries();
			console.log(savedEntries, "savedEntries right before setting the state:entries");
			setEntries(savedEntries);
		}
		fetchEntries();
	}, []);

	// ------ WHENEVER PICTURES CHANGES THE IMAGES GET DISTRIBUTED AGAIN ------
	// Has to do with adding placeholder pictures (nothing todo with folder)
	// AHHHHHH AND INITIALLY THIS RUNS ONCE
	useEffect(() => {
		distributeImages(pictures);
	}, [pictures]);

	const distributeImages = (images) => {
		const newEntries = [];
		let currentEntry = {
			id: uuidv4(),
			pictures: { A: null, B: null, C: null },
		};
		let columnIndex = 0;

		for (let i = 0; i < images.length; i++) {
			currentEntry.pictures[String.fromCharCode(65 + columnIndex)] = images[i];
			columnIndex++;

			if (columnIndex === numPicturesPerEntry) {
				newEntries.push(currentEntry);
				currentEntry = {
					id: uuidv4(),
					pictures: { A: null, B: null, C: null },
				};
				columnIndex = 0;
			}
		}

		if (columnIndex > 0) {
			newEntries.push(currentEntry);
		}

		setEntries(newEntries);
		window.electron.saveEntries(newEntries);
	};

	const addPicture = (picture, entryId, column) => {
		const newPictures = [...pictures];
		const entryIndex = entries.findIndex((entry) => entry.id === entryId);
		const pictureIndex = entryIndex * numPicturesPerEntry + column.charCodeAt(0) - 65;

		newPictures.splice(pictureIndex, 0, picture);
		setPictures(newPictures);
		window.electron.saveEntries(newEntries);
	};

	const addDefaultPicture = (entryId, column) => {
		addPicture("default.jpg", entryId, column);
	};

	const removePicture = (entryId, column) => {
		const entryIndex = entries.findIndex((entry) => entry.id === entryId);
		const pictureToRemove = entries[entryIndex].pictures[column];

		if (pictureToRemove) {
			const newPictures = pictures.filter((pic) => pic !== pictureToRemove);
			setPictures(newPictures);
			setRemovedPictures((prevRemoved) => [...prevRemoved, pictureToRemove]);

			const updatedEntries = [...entries];
			updatedEntries[entryIndex].pictures[column] = null;

			setEntries(updatedEntries);
			window.electron.saveEntries(updatedEntries);
		}
	};

	const handleDragStart = (event, image) => {
		setDraggedPicture(image);
		event.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (event, targetIndex) => {
		event.preventDefault();
		const targetRect = event.target.getBoundingClientRect();
		const midPoint = targetRect.left + targetRect.width / 2;
		if (event.clientX < midPoint) {
			setDragOverPosition("left");
		} else {
			setDragOverPosition("right");
		}
		setDragOverIndex(targetIndex);
		event.dataTransfer.dropEffect = "move";
	};

	const handleDrop = (event, targetIndex) => {
		event.preventDefault();
		const draggedIndex = pictures.indexOf(draggedPicture);
		if (draggedIndex !== -1 && targetIndex !== draggedIndex) {
			const updatedPictures = [...pictures];
			updatedPictures.splice(draggedIndex, 1);
			const newTargetIndex = dragOverPosition === "left" ? targetIndex : targetIndex + 1;
			updatedPictures.splice(newTargetIndex, 0, draggedPicture);
			setPictures(updatedPictures);
			window.electron.saveEntries(updatedPictures);
		}
		setDraggedPicture(null);
		setDragOverIndex(null);
		setDragOverPosition(null);
	};

	console.log(window.electron);

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4">Picture Gallery</h2>

			{/* Display removed pictures at the top */}
			<div className="mt-6">
				<h2 className="text-2xl font-bold mb-4">Removed Pictures</h2>
				<div className="flex flex-wrap gap-4">
					{removedPictures.map((picture, index) => (
						<div key={index} className="w-32 h-32 border border-gray-300">
							<img
								src={picture}
								alt={`Removed Picture ${index}`}
								className="w-full h-full object-cover"
							/>
						</div>
					))}
				</div>
			</div>

			{/* Display entries */}
			<div className="mt-6">
				<h2 className="text-2xl font-bold mb-4">Entries</h2>

				<button
					onClick={async () => {
						const allEntries = await window.electron.getEntries();

						// Function to introduce delay
						const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

						for (const entry of allEntries) {
							console.log(`Entry ID: ${entry.id}`);

							let picturePaths = [];
							Object.keys(entry.pictures).forEach((column) => {
								picturePaths.push(entry.pictures[column]);
							});

							// Call the API and wait for it to complete
							await window.electron.createShopifyEntries(picturePaths);

							// Introduce a half-second delay
							await delay(700);
						}
					}}
					className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
				>
					Process Entries
				</button>

				<div className="grid grid-cols-1 gap-4">
					{entries.map((entry) => (
						<div key={entry.id} className="p-4 border rounded">
							<h3 className="text-xl font-semibold mb-2">Entry {entry.id}</h3>
							<div className="flex flex-wrap gap-4">
								{Object.keys(entry.pictures).map((column, index) => (
									<div key={column} className="relative flex items-center">
										{dragOverIndex ===
											pictures.indexOf(entry.pictures[column]) &&
											dragOverPosition === "left" && (
												<div className="w-1 h-32 bg-blue-500"></div>
											)}
										<div
											className={`w-32 h-32 border ${
												draggedPicture === entry.pictures[column]
													? "border-gray-600"
													: "border-gray-300"
											}`}
											draggable
											onDragStart={(event) =>
												handleDragStart(event, entry.pictures[column])
											}
											onDragOver={(event) =>
												handleDragOver(
													event,
													pictures.indexOf(entry.pictures[column])
												)
											}
											onDrop={(event) =>
												handleDrop(
													event,
													pictures.indexOf(entry.pictures[column])
												)
											}
										>
											{entry.pictures[column] ? (
												<img
													src={entry.pictures[column]}
													alt={`Entry ${entry.id} ${column}`}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full bg-gray-200 flex items-center justify-center">
													<span className="text-gray-500">{column}</span>
												</div>
											)}
										</div>
										{dragOverIndex ===
											pictures.indexOf(entry.pictures[column]) &&
											dragOverPosition === "right" && (
												<div className="w-1 h-32 bg-green-500"></div>
											)}
										<div className="flex flex-col items-center">
											<button
												onClick={() => removePicture(entry.id, column)}
												className="mt-2 px-2 py-1 bg-red-500 text-white rounded"
											>
												Remove
											</button>
											<button
												onClick={() => addDefaultPicture(entry.id, column)}
												className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
											>
												Add Before
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PictureGallery;
