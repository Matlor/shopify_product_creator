import React, { useState, useEffect } from "react";
import { readdir } from "fs/promises";
import { join } from "path";

const PictureGallery = ({ folderPath, numPictures, selectedPictures, setSelectedPictures }) => {
	const [pictures, setPictures] = useState([]);

	useEffect(() => {
		const loadPictures = async () => {
			try {
				const files = await readdir(folderPath);
				const jpgFiles = files.filter(
					(file) => file.endsWith(".jpg") || file.endsWith(".jpeg")
				);
				setPictures(jpgFiles);
			} catch (error) {
				console.error("Error reading pictures:", error);
			}
		};

		loadPictures();
	}, [folderPath]);

	const handlePictureClick = (picture) => {
		if (selectedPictures.includes(picture)) {
			setSelectedPictures(selectedPictures.filter((p) => p !== picture));
		} else if (selectedPictures.length < numPictures) {
			setSelectedPictures([...selectedPictures, picture]);
		}
	};

	return (
		<div className="flex flex-wrap">
			{pictures.map((picture) => (
				<div
					key={picture}
					onClick={() => handlePictureClick(picture)}
					className={`m-2 p-2 border rounded cursor-pointer ${
						selectedPictures.includes(picture) ? "border-blue-500" : "border-gray-300"
					}`}
				>
					<img
						src={join(folderPath, picture)}
						alt={picture}
						className="w-32 h-32 object-cover"
					/>
				</div>
			))}
		</div>
	);
};

export default PictureGallery;
