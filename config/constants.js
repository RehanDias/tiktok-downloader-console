/**
 * Configuration Constants Module
 *
 * This module contains constant values and configurations used throughout the application
 * for TikTok video and image downloading functionality.
 *
 * @module constants
 */

/**
 * Desktop browser User-Agent string for making HTTP requests
 * @constant {string}
 */
const USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Mobile device User-Agent string for TikTok API requests
 * @constant {string}
 */
const MOBILE_USER_AGENT =
    "TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet";

/**
 * Regular expression pattern for validating TikTok URLs
 * @constant {RegExp}
 */
const TIKTOK_URL_REGEX = /^https?:\/\/(www\.|vm\.)?(tiktok\.com)\/?(.*)$/;

/**
 * Base URL for the TikTok downloader API
 * @constant {string}
 */
const API_URL = "https://api-tiktok-downloader.vercel.app/api/v4/download";

/**
 * Default query parameters for TikTok web requests
 * @constant {string}
 */
const QUERY_PARAMS =
    "?is_from_webapp=1&sender_device=pc&web_id=7221493350775866882";

/**
 * Directory path for storing downloaded videos
 * @constant {string}
 */
const VIDEO_DIR = "./tiktok-videos";

/**
 * Directory path for storing downloaded images
 * @constant {string}
 */
const IMAGE_DIR = "./tiktok-images";

module.exports = {
    USER_AGENT,
    MOBILE_USER_AGENT,
    TIKTOK_URL_REGEX,
    API_URL,
    QUERY_PARAMS,
    VIDEO_DIR,
    IMAGE_DIR,
};
