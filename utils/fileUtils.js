/**
 * File System Utilities Module
 *
 * Provides utility functions for file system operations,
 * particularly focused on directory management for the TikTok downloader.
 *
 * @module fileUtils
 * @requires fs
 */

const fs = require("fs");

/**
 * Creates a directory if it doesn't exist
 *
 * This utility function checks for the existence of a directory and creates it
 * if it's not present. It supports creating nested directory structures using
 * the recursive option.
 *
 * @param {string} dirPath - Absolute or relative path to the directory
 * @throws {Error} If directory creation fails or if there are insufficient permissions
 *
 */
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

module.exports = {
    ensureDirectoryExists,
};
