/**
 * Data Extractor Module
 *
 * Handles the extraction and parsing of TikTok video data from JSON responses.
 * This module provides utilities for parsing and validating video metadata
 * from TikTok's embedded JSON data.
 *
 * @module dataExtractor
 */

/**
 * Extracts and validates the video detail object from parsed JSON
 *
 * @param {Object} parsedJSON - The parsed JSON object from TikTok's response
 * @returns {Object} The video detail object containing essential video information
 * @throws {Error} If video detail data is not found in the response
 */
const parseVideoDetail = (parsedJSON) => {
    const videoDetail = parsedJSON?.__DEFAULT_SCOPE__?.["webapp.video-detail"];
    if (!videoDetail) {
        throw new Error("Video data not found in JSON response");
    }
    return videoDetail;
};

/**
 * Retrieves and validates the item structure containing core video metadata
 *
 * @param {Object} videoDetail - The video detail object from TikTok's response
 * @returns {Object} The item structure containing video metadata
 * @throws {Error} If item structure is missing or invalid
 */
const getItemStruct = (videoDetail) => {
    const itemStruct = videoDetail.itemInfo?.itemStruct;
    if (!itemStruct) {
        throw new Error("Item structure not found in JSON response");
    }
    return itemStruct;
};

/**
 * Validates the presence of author and video data within the item structure
 *
 * @param {Object} itemStruct - The item structure containing video metadata
 * @returns {Object} Object containing validated author and video data
 * @throws {Error} If either author or video data is missing
 */
const validateAuthorAndVideo = (itemStruct) => {
    const { author, video } = itemStruct;
    if (!author || !video) {
        throw new Error("Author or video data missing in response");
    }
    return { author, video };
};

/**
 * Extracts the video URL from various possible locations in the video object
 *
 * Implements a fallback strategy:
 * 1. Attempts to extract from bitrateInfo.PlayAddr
 * 2. Falls back to direct playAddr if primary method fails
 *
 * @param {Object} video - The video object containing URL information
 * @returns {string} The extracted video URL
 * @throws {Error} If no valid video URL can be found
 */
const extractVideoUrl = (video) => {
    // Try bitrateInfo first
    if (video.bitrateInfo?.length > 0) {
        const playAddr = video.bitrateInfo[0].PlayAddr;
        if (playAddr?.UrlList?.[0]) {
            return playAddr.UrlList[0];
        }
    }

    // Fallback to direct playAddr
    if (video.playAddr) {
        return video.playAddr;
    }

    throw new Error("Video URL not found in response");
};

/**
 * Main function to extract and process video data from TikTok's JSON response
 *
 * This function orchestrates the complete extraction process:
 * 1. Parses the raw JSON data
 * 2. Extracts and validates video details
 * 3. Processes author and video information
 * 4. Compiles the final video metadata object
 *
 * @param {string} rawJSON - Raw JSON string from TikTok's response
 * @returns {Object|null} Processed video data object containing:
 *   - authorUniqueId: Creator's unique identifier
 *   - authorNickname: Creator's display name
 *   - videoId: Unique video identifier
 *   - createTime: Video creation timestamp
 *   - videoUrl: Direct URL to video content
 *   - description: Video caption/description
 * @returns {null} If extraction fails at any point
 */
const extractVideoDataFromJson = (rawJSON) => {
    try {
        const parsedJSON = JSON.parse(rawJSON);
        const videoDetail = parseVideoDetail(parsedJSON);
        const itemStruct = getItemStruct(videoDetail);
        const { author, video } = validateAuthorAndVideo(itemStruct);
        const videoUrl = extractVideoUrl(video);

        return {
            authorUniqueId: author.uniqueId,
            authorNickname: author.nickname,
            videoId: itemStruct.id,
            createTime: itemStruct.createTime,
            videoUrl: videoUrl,
            description: itemStruct.desc,
        };
    } catch (error) {
        console.error(`Error extracting video data: ${error.message}`);
        return null;
    }
};

module.exports = {
    extractVideoDataFromJson,
};
