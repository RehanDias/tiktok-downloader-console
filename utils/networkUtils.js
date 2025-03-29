/**
 * Network Utilities Module
 *
 * Provides network-related utility functions and configurations for making HTTP requests.
 * This module handles cookie management, request instances, and file downloading
 * functionality used throughout the application.
 *
 * @module networkUtils
 * @requires axios
 * @requires axios-cookiejar-support
 * @requires tough-cookie
 * @requires constants
 */

const axios = require("axios").default;
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");
const { USER_AGENT } = require("../config/constants");

/**
 * Cookie jar instance for managing cookies across requests
 * @constant {CookieJar}
 * @private
 */
const cookieJar = new CookieJar();

/**
 * Configured axios instance with cookie support
 * @constant {AxiosInstance}
 * @public
 */
const instance = wrapper(
    axios.create({
        withCredentials: true,
        jar: cookieJar,
    })
);

/**
 * Downloads a file from a specified URL with appropriate headers
 * 
 * Makes an HTTP request to download file content while maintaining proper
 * headers and referrer information. Supports different response types
 * for various content formats.
 *
 * @async
 * @param {string} url - The complete URL of the file to download
 * @param {string} referer - The referrer URL for the request header
 * @param {string} [responseType='arraybuffer'] - Expected response type (e.g., 'arraybuffer', 'json')
 * @returns {Promise<Buffer|Object>} Downloaded file content as buffer or parsed object
 * @throws {Error} If download fails or response is invalid

 */
const downloadFile = async (url, referer, responseType = "arraybuffer") => {
    try {
        const response = await instance(url, {
            headers: {
                Referer: referer,
                "User-Agent": USER_AGENT,
            },
            responseType: responseType,
        });
        return response.data;
    } catch (error) {
        console.error(`Error downloading file: ${error.message}`);
        throw error;
    }
};

module.exports = {
    instance,
    downloadFile,
};
