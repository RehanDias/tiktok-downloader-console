/**
 * Download Service Module
 *
 * Provides functionality for downloading TikTok media content (images and videos).
 * This module handles the actual file downloading and saving operations,
 * managing both single video files and multiple images from photo posts.
 *
 * @module downloadService
 * @requires fs
 * @requires networkUtils
 * @requires fileUtils
 * @requires dateUtils
 * @requires constants
 */

const fs = require("fs");
const { downloadFile } = require("../utils/networkUtils");
const { ensureDirectoryExists } = require("../utils/fileUtils");
const { formatUploadDate } = require("../utils/dateUtils");
const { IMAGE_DIR, VIDEO_DIR, USER_AGENT } = require("../config/constants");
const { instance } = require("../utils/networkUtils");

/**
 * Downloads and saves multiple images from a TikTok photo post
 *
 * This function handles the download of all images associated with a TikTok post,
 * including proper file naming and organization.
 *
 * @async
 * @param {string} url - The original TikTok post URL (used as referer)
 * @param {string} imageId - Unique identifier for the image collection
 * @param {string[]} imageUrls - Array of URLs for all images to download
 * @param {number} timestamp - Unix timestamp of post creation
 * @param {string} authorId - Creator's unique TikTok identifier
 * @returns {Promise<void>} Resolves when all images are successfully downloaded
 * @throws {Error} If download fails or directory creation fails
 *
 */
const downloadImages = async (url, imageId, imageUrls, timestamp, authorId) => {
    try {
        const requestHeaders = {
            Referer: url,
            "User-Agent": USER_AGENT,
        };

        for (let i = 0; i < imageUrls.length; i++) {
            const imageUrl = imageUrls[i];
            const response = await instance(imageUrl, {
                headers: requestHeaders,
                responseType: "arraybuffer",
            });

            const formattedDate = formatUploadDate(timestamp);
            const fileName = `${authorId}_image_${formattedDate}_${imageId}_${
                i + 1
            }.jpg`;

            ensureDirectoryExists(IMAGE_DIR);
            fs.writeFileSync(`${IMAGE_DIR}/${fileName}`, response.data);

            console.log(
                `Image ${i + 1}/${
                    imageUrls.length
                } successfully downloaded: ${fileName}`
            );
        }
    } catch (error) {
        console.error(`Error downloading images from ${url}: ${error.message}`);
    }
};

/**
 * Downloads and saves a single TikTok video
 *
 * This function handles the complete video download process, including:
 * - Downloading the video content
 * - Generating appropriate filename
 * - Ensuring target directory exists
 * - Saving the file with proper metadata
 *
 * @async
 * @param {Object} videoData - Video metadata and download information
 * @param {string} videoData.videoUrl - Direct URL to the video content
 * @param {number} videoData.createTime - Unix timestamp of video creation
 * @param {string} videoData.authorUniqueId - Creator's TikTok identifier
 * @param {string} videoData.videoId - Unique identifier for the video
 * @param {string} url - Original TikTok post URL (used as referer)
 * @returns {Promise<string>} The filename of the saved video
 * @throws {Error} If download fails, directory creation fails, or file writing fails
 *
 */
const downloadVideo = async (videoData, url) => {
    // Download video
    const videoBuffer = await downloadFile(videoData.videoUrl, url);

    // Create filename
    const formattedDate = formatUploadDate(videoData.createTime);
    const fileName = `${videoData.authorUniqueId}_video_${formattedDate}_${videoData.videoId}.mp4`;

    // Save file
    ensureDirectoryExists(VIDEO_DIR);
    fs.writeFileSync(`${VIDEO_DIR}/${fileName}`, videoBuffer);

    console.log(`Video successfully downloaded: ${fileName}`);
    return fileName;
};

module.exports = {
    downloadImages,
    downloadVideo,
};
