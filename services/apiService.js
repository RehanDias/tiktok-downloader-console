/**
 * TikTok API Service Module
 *
 * Provides functionality to interact with the TikTok downloader API.
 * This module handles all API communications and response parsing
 * for retrieving media information from TikTok posts.
 *
 * @module apiService
 * @requires networkUtils
 * @requires constants
 */

const { instance } = require("../utils/networkUtils");
const { MOBILE_USER_AGENT, API_URL } = require("../config/constants");

/**
 * Headers configuration for API requests
 * @constant {Object}
 * @private
 */
const headers = {
    "User-Agent": MOBILE_USER_AGENT,
};

/**
 * Retrieves media information from the TikTok downloader API
 *
 * This function serves as a backup method when direct HTML extraction fails.
 * It makes an HTTP request to the API and processes the response to extract
 * media information for both videos and photos.
 *
 * @async
 * @param {string} url - The complete TikTok post URL to fetch information for
 * @returns {Promise<Object>} Media information object containing:
 *   - For videos: type, id, createTime, author, video details
 *   - For photos: type, id, createTime, author, image URLs
 * @throws {Error} If the API request fails, returns non-success status, or response format is invalid
 *
 */
const getMediaInfoFromAPI = async (url) => {
    try {
        const apiUrl = `${API_URL}?url=${encodeURIComponent(url)}`;
        const response = await instance(apiUrl, {
            method: "GET",
            headers: headers,
        });

        if (response.data.status !== "success") {
            throw new Error(`API return status: ${response.data.status}`);
        }

        return response.data.result;
    } catch (error) {
        console.error(`Error fetching info from API: ${error.message}`);
        throw error;
    }
};

module.exports = {
    getMediaInfoFromAPI,
};
