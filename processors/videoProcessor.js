/**
 * Video Processing Module
 *
 * Provides functionality for processing and downloading TikTok videos.
 * This module implements a dual-strategy approach:
 * 1. Direct extraction from HTML (primary method)
 * 2. API-based extraction (fallback method)
 *
 * The module coordinates between HTML parsing, API services, and download services
 * to ensure reliable video extraction and downloading.
 *
 * @module videoProcessor
 * @requires htmlService
 * @requires apiService
 * @requires downloadService
 * @requires dataExtractor
 */

const { handleHtml, getDocument } = require("../services/htmlService");
const { getMediaInfoFromAPI } = require("../services/apiService");
const { downloadVideo } = require("../services/downloadService");
const { extractVideoDataFromJson } = require("../extractors/dataExtractor");

/**
 * Processes a TikTok video URL by extracting metadata and downloading the video content
 *
 * This function implements a fallback strategy for video processing:
 * 1. Attempts direct extraction from HTML (preferred method)
 * 2. Falls back to API-based extraction if HTML extraction fails
 * 3. Downloads the video using the obtained metadata
 *
 * @async
 * @param {string} url - The complete TikTok video URL to process
 * @throws {Error} When both extraction methods fail or video data is invalid
 * @returns {Promise<void>} Resolves when video is successfully processed and downloaded
 *
 * @example
 * try {
 *   await processVideoPost('https://www.tiktok.com/@user/video/1234567890');
 * } catch (error) {
 *   console.error('Video processing failed:', error);
 * }
 */
const processVideoPost = async (url) => {
    try {
        console.log(`Processing video: ${url}`);

        // Try getting video data from HTML first
        const html = await handleHtml(url);
        const $ = getDocument(html);
        const jsonDataElement = $("#__UNIVERSAL_DATA_FOR_REHYDRATION__");

        let videoData;
        let useDirectExtraction = false;

        if (jsonDataElement && jsonDataElement.length > 0) {
            const rawJSON = jsonDataElement[0]?.children?.[0]?.data;
            if (rawJSON) {
                videoData = extractVideoDataFromJson(rawJSON);
                if (videoData) {
                    useDirectExtraction = true;
                    console.log(
                        "METHOD: Direct extraction from HTML successful"
                    );
                }
            }
        }

        // If direct extraction fails, use API as backup
        if (!useDirectExtraction) {
            console.log("HTML extraction failed. Using API as backup...");
            videoData = await getMediaInfoFromAPI(url);

            if (
                videoData.type !== "video" ||
                !videoData.video ||
                !videoData.video.playAddr
            ) {
                throw new Error("Invalid video data from API");
            }

            console.log("METHOD: Using backup API successful");

            videoData = {
                authorUniqueId: videoData.author.username,
                videoId: videoData.id,
                createTime: videoData.createTime,
                videoUrl: videoData.video.playAddr[0],
            };
        }

        // Download video
        await downloadVideo(videoData, url);

        console.log(
            `Method used: ${
                useDirectExtraction
                    ? "Direct extraction from HTML"
                    : "Backup API"
            }`
        );
    } catch (error) {
        console.error(`Failed to process video from ${url}: ${error.message}`);
    }
};

module.exports = {
    processVideoPost,
};
