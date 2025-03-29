/**
 * Photo Processing Module
 *
 * Handles the processing and downloading of TikTok photo posts.
 * This module coordinates between the API service for fetching photo information
 * and the download service for saving the images.
 *
 * @module photoProcessor
 */

const { getMediaInfoFromAPI } = require("../services/apiService");
const { downloadImages } = require("../services/downloadService");

/**
 * Processes a TikTok photo post URL by extracting and downloading associated images
 *
 * This function orchestrates the complete photo processing workflow:
 * 1. Fetches photo metadata from TikTok's API
 * 2. Validates the response data
 * 3. Downloads all images associated with the post
 * 4. Handles any errors that occur during processing
 *
 * @async
 * @param {string} url - The complete TikTok photo post URL to process
 * @throws {Error} - If photo data is invalid or missing
 * @returns {Promise<void>} - Resolves when all images are successfully downloaded
 *
 * @example
 * try {
 *   await processPhotoPost('https://www.tiktok.com/@user/photo/1234567890');
 * } catch (error) {
 *   console.error('Photo processing failed:', error);
 * }
 */
const processPhotoPost = async (url) => {
    try {
        console.log(`Processing photo: ${url}`);

        // Get photo metadata from API
        const photoData = await getMediaInfoFromAPI(url);

        // Validate photo data
        if (
            photoData.type !== "image" ||
            !photoData.images ||
            photoData.images.length === 0
        ) {
            throw new Error("Invalid or missing photo data");
        }

        // Download all images associated with the post
        await downloadImages(
            url,
            photoData.id,
            photoData.images,
            photoData.createTime,
            photoData.author.username
        );

        console.log(`All images successfully downloaded from ${url}`);
    } catch (error) {
        console.error(`Failed to process photo from ${url}: ${error.message}`);
    }
};

module.exports = {
    processPhotoPost,
};
