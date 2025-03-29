/**
 * Date Utilities Module
 *
 * Provides utility functions for date formatting and manipulation,
 * specifically tailored for TikTok media download filename generation.
 *
 * @module dateUtils
 */

/**
 * Formats a Unix timestamp into a standardized date string
 *
 * Converts a Unix timestamp into a compact date string suitable for filenames.
 * The output format is DDMMYYYY where:
 * - DD: Day of month (01-31)
 * - MM: Month (01-12)
 * - YYYY: Full year
 *
 * @param {number} timestamp - Unix timestamp in seconds (not milliseconds)
 * @returns {string} Formatted date string in DDMMYYYY format
 * @throws {Error} If timestamp is invalid or out of range
 *
 */
const formatUploadDate = (timestamp) => {
    const createdDate = new Date(timestamp * 1000);
    return `${createdDate.getDate().toString().padStart(2, "0")}${(
        createdDate.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}${createdDate.getFullYear()}`;
};

module.exports = {
    formatUploadDate,
};
