/**
 * HTML Service Module
 *
 * Provides functionality for fetching and parsing HTML content from TikTok pages.
 * This module handles HTTP requests for HTML content and converts the responses
 * into parseable DOM structures using Cheerio.
 *
 * @module htmlService
 * @requires cheerio
 * @requires networkUtils
 * @requires constants
 */

const cheerio = require("cheerio");
const { instance } = require("../utils/networkUtils");
const { USER_AGENT } = require("../config/constants");

/**
 * Fetches HTML content from a specified URL
 *
 * Makes an HTTP request to retrieve the HTML content of a webpage,
 * using appropriate headers to mimic a real browser request.
 *
 * @async
 * @param {string} url - The complete URL to fetch HTML content from
 * @returns {Promise<string>} The raw HTML content as a string
 * @throws {Error} If the request fails or returns invalid content
 *
 */
const handleHtml = async (url) => {
    try {
        let res = await instance(url, {
            headers: {
                "User-Agent": USER_AGENT,
            },
        });
        return res.data;
    } catch (e) {
        console.error(`Error fetching HTML: ${e.message}`);
        throw new Error(e);
    }
};

/**
 * Parses HTML content into a Cheerio DOM structure
 *
 * Converts raw HTML string into a queryable DOM structure using Cheerio,
 * enabling jQuery-like syntax for HTML parsing and manipulation.
 *
 * @param {string} html - Raw HTML content to parse
 * @returns {CheerioAPI} Cheerio instance for DOM manipulation
 * @throws {Error} If HTML parsing fails or content is invalid
 *
 */
const getDocument = (html) => {
    try {
        return cheerio.load(html);
    } catch (e) {
        console.error(`Error parsing HTML: ${e.message}`);
        throw new Error(e);
    }
};

module.exports = {
    handleHtml,
    getDocument,
};
