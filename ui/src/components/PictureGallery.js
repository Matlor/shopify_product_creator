import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const PictureGallery = () => {
	const numPicturesPerEntry = 3; // Fixed number of pictures per entry
	const [pictures, setPictures] = useState([
		"pic1.jpeg",
		"pic2.jpeg",
		"pic3.jpeg",
		"pic4.jpeg",
		"pic5.jpeg",
		"pic6.jpeg",
	]);
	const [entries, setEntries] = useState([]);
	const [draggedPicture, setDraggedPicture] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);
	const [dragOverPosition, setDragOverPosition] = useState(null);

	useEffect(() => {
		distributeImages(pictures);
	}, [pictures]);

	const distributeImages = (images) => {
		const newEntries = [];
		let currentEntry = { id: uuidv4(), pictures: { A: null, B: null, C: null } };
		let columnIndex = 0;

		for (let i = 0; i < images.length; i++) {
			currentEntry.pictures[String.fromCharCode(65 + columnIndex)] = images[i];
			columnIndex++;

			if (columnIndex === numPicturesPerEntry) {
				newEntries.push(currentEntry);
				currentEntry = { id: uuidv4(), pictures: { A: null, B: null, C: null } };
				columnIndex = 0;
			}
		}

		if (columnIndex > 0) {
			newEntries.push(currentEntry);
		}

		setEntries(newEntries);
	};

	const addPicture = (picture, entryId, column) => {
		const newPictures = [...pictures];
		const entryIndex = entries.findIndex((entry) => entry.id === entryId);
		const pictureIndex = entryIndex * numPicturesPerEntry + column.charCodeAt(0) - 65;

		newPictures.splice(pictureIndex, 0, picture);
		setPictures(newPictures);
	};

	const removePicture = (entryId, column) => {
		const entryIndex = entries.findIndex((entry) => entry.id === entryId);
		const pictureToRemove = entries[entryIndex].pictures[column];

		const newPictures = pictures.filter((pic) => pic !== pictureToRemove);
		setPictures(newPictures);
	};

	const addDefaultPicture = (entryId, column) => {
		addPicture("default.jpg", entryId, column);
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
		}
		setDraggedPicture(null);
		setDragOverIndex(null);
		setDragOverPosition(null);
	};

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4">Picture Gallery</h2>
			<div className="mt-6">
				<h2 className="text-2xl font-bold mb-4">Entries</h2>
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
