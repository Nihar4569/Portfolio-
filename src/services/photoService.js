// src/services/photoService.js
// This service handles fetching photos from directories
// Optimized for performance with reduced delay

/**
 * Fetches photos from a directory path
 * This is a mock implementation for development - in production this would be a server API call
 * 
 * @param {string} directoryPath - The path to the photo directory
 * @returns {Promise<Array>} - A promise resolving to an array of photo objects
 */
export const fetchPhotosFromDirectory = async (directoryPath) => {
    // Default number of photos per directory
    const photoCountMap = {
      "/images/albums/soa": 27,
      "/images/albums/sih": 8,
      "/images/albums/school-memories": 12,
      "/images/albums/hometown": 20
    };
    
    // Get number of photos for this directory or use default of 10
    const photoCount = photoCountMap[directoryPath] || 10;
    
    // Generate photo objects with sequential filenames 
    const photos = [];
    for (let i = 1; i <= photoCount; i++) {
      photos.push({
        id: i,
        url: `${directoryPath}/photo${i}.jpg`,
        caption: ''
      });
    }
    
    // Randomize the photo order using Fisher-Yates shuffle algorithm
    for (let i = photos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [photos[i], photos[j]] = [photos[j], photos[i]];
    }
  
    // Minimal delay - just enough to prevent UI blocking
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return photos;
  };
  
  const photoService = { fetchPhotosFromDirectory };
  export default photoService;