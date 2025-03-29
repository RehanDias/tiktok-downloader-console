/**
 * URL Validation Module
 *
 * Provides utilities for validating TikTok URLs and ensuring they match
 * the expected format before processing. This module helps prevent
 * invalid URLs from being processed by the downloader.
 *
 * @module urlUtils
 * @requires constants
 */

const { TIKTOK_URL_REGEX } = require("../config/constants");

/**
 * Validates whether a given string is a properly formatted TikTok URL
 *
 * This function checks if the provided URL matches the expected TikTok URL pattern,
 * supporting both www.tiktok.com and vm.tiktok.com domains.
 *
 * @param {string} url - The URL string to validate
 * @returns {boolean} True if the URL is a valid TikTok URL, false otherwise
 *
 */
const validateURL = (url) => {
    if (!url || typeof url !== "string") return false;
    return TIKTOK_URL_REGEX.test(url);
};

module.exports = {
    validateURL,
};
