/**
 * TikTok Media Downloader Application
 *
 * Main application module that orchestrates the downloading of TikTok videos and photos.
 * Features include:
 * - URL validation
 * - Automatic media type detection (photo/video)
 * - Rate limiting protection
 * - Parallel download management
 * - Error handling and recovery
 *
 * @module index
 * @requires urlUtils
 * @requires videoProcessor
 * @requires photoProcessor
 */

const { validateURL } = require("./utils/urlUtils");
const { processVideoPost } = require("./processors/videoProcessor");
const { processPhotoPost } = require("./processors/photoProcessor");

/**
 * Processes multiple TikTok URLs sequentially
 *
 * This function coordinates the processing of multiple TikTok URLs, handling both
 * videos and photos. It includes:
 * - URL validation
 * - Rate limiting protection via delays
 * - Automatic media type detection
 * - Error handling per URL
 *
 * @async
 * @param {string[]} urls - Array of TikTok URLs to process
 * @returns {Promise<void>} Resolves when all URLs have been processed
 * @throws {Error} If there's a fatal error during processing
 *
 * @example
 * const urls = [
 *"https://www.tiktok.com/@user1/video/1234567890123456789",
 *"https://www.tiktok.com/@user2/video/2345678901234567890",
 *"https://www.tiktok.com/@user3/photo/3456789012345678901",
 *"https://www.tiktok.com/@user4/photo/4567890123456789012",
 * ];
 *
 * try {
 *   await processUrls(urls);
 * } catch (error) {
 *   console.error('Processing failed:', error);
 * }
 */
const processUrls = async (urls) => {
    console.log(`Starting to process ${urls.length} TikTok URLs...`);

    for (const url of urls) {
        if (!validateURL(url)) {
            console.error(`Invalid TikTok URL: ${url}`);
            continue;
        }

        try {
            // Add delay to avoid rate limiting
            if (urls.indexOf(url) > 0) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }

            // Detect if URL is photo or video
            if (url.includes("/photo/")) {
                await processPhotoPost(url);
            } else {
                await processVideoPost(url);
            }
        } catch (error) {
            console.error(`Error processing ${url}: ${error.message}`);
        }
    }

    console.log("All URLs have been processed!");
};

/**
 * Application Entry Point
 *
 * Self-executing async function that initializes and runs the application.
 * Provides a list of TikTok URLs to process and handles any fatal errors
 * that occur during execution.
 *
 * @async
 * @throws {Error} If there's an unrecoverable error during execution
 */
(async () => {
    const urls = [
        "https://www.tiktok.com/@user1/video/1234567890123456789",
        "https://www.tiktok.com/@user2/video/2345678901234567890",
        "https://www.tiktok.com/@user3/photo/3456789012345678901",
        "https://www.tiktok.com/@user4/photo/4567890123456789012",
    ];

    try {
        await processUrls(urls);
    } catch (error) {
        console.error(`Fatal error: ${error.message}`);
        process.exit(1);
    }
})();
