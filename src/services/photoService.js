import albums from '../data/albums.js';

/**
 * Lists photos and thumbnails for an album included in the portfolio build.
 * 
 * @param {string} directoryPath - The path to the photo directory
 * @returns {Promise<Array>} - A promise resolving to an array of photo objects
 */
export const fetchPhotosFromDirectory = async (directoryPath) => {
    const photoCount = albums.find((album) => album.photoDirectory === directoryPath)?.photoCount ?? 0;
    
    // Generate photo objects with sequential filenames 
    const photos = [];
    for (let i = 1; i <= photoCount; i++) {
      photos.push({
        id: i,
        url: `${directoryPath}/photo${i}.jpg`,
        thumbnail: `${directoryPath}/thumbnails/photo${i}.avif`,
        caption: ''
      });
    }
    
    // Randomize the photo order using Fisher-Yates shuffle algorithm
    for (let i = photos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [photos[i], photos[j]] = [photos[j], photos[i]];
    }
  
    return photos;
  };
  
  const photoService = { fetchPhotosFromDirectory };
  export default photoService;
