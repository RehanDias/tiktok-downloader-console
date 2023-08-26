/**
 * TikTok Video Downloader and Information Extractor
 *
 * This script utilizes various modules to download TikTok videos and extract valuable information
 * from them. It relies on Axios for making HTTP requests, Cheerio for parsing HTML content,
 * and Tough-Cookie for handling cookies. The primary purpose of the script is to process a list
 * of TikTok video URLs, retrieve their video data, download the video files, and extract relevant
 * information from the video pages.
 *
 * Important: Please replace the placeholder values like "replace with..." with actual and valid values.
 */

/**
 * Module for interacting with the file system.
 * @const fs
 * @type {object}
 * @see {@link https://nodejs.org/api/fs.html|Node.js fs Documentation}
 */
const fs = require("fs");

/**
 * HTTP module for making HTTP requests.
 * @const axios
 * @type {object}
 * @see {@link https://axios-http.com/docs/intro|Axios Documentation}
 */
const axios = require("axios").default;

/**
 * Axios module with cookie management support.
 * @const axiosCookieJarSupport
 * @type {object}
 * @see {@link https://www.npmjs.com/package/axios-cookiejar-support|axios-cookiejar-support on npm}
 */
const { wrapper } = require("axios-cookiejar-support");

/**
 * Module for handling cookies in a robust form.
 * @const toughCookie
 * @type {object}
 * @see {@link https://www.npmjs.com/package/tough-cookie|tough-cookie on npm}
 */
const { CookieJar } = require("tough-cookie");

/**
 * Module for parsing and manipulating HTML documents using jQuery-like syntax.
 * @const cheerio
 * @type {function}
 * @see {@link https://cheerio.js.org/|Cheerio Documentation}
 */
const cheerio = require("cheerio");

/**
 * User agent to be used in the HTTP requests.
 * @const USER_AGENT
 * @type {string}
 */
const USER_AGENT = "replace with desired user agent";

/**
 * Regular expression to validate TikTok URLs.
 * @const REGEX
 * @type {RegExp}
 */
const REGEX = /^https?:\/\/(www\.|vm\.)?(tiktok\.com)\/?(.*)$/;

/**
 * Container for storing cookies and managing sessions in HTTP requests.
 * @const cookieJar
 * @type {CookieJar}
 */
const cookieJar = new CookieJar();

/**
 * Fetches HTML content from a URL using Axios.
 *
 * @param {string} url - URL to fetch HTML content from.
 * @returns {Promise<string>} - HTML content.
 * @throws {Error} - If an error occurs during the request.
 */
const handleHtml = async (url) => {
	try {
		// Sending an HTTP request to fetch HTML content.
		let res = await instance(url, {
			headers: {
				"User-Agent": USER_AGENT,
			},
		});

		const { data } = res;
		return data;
	} catch (e) {
		throw new Error(e);
	}
};

/**
 * Loads HTML content into a Cheerio instance.
 *
 * @param {string} html - HTML content to load.
 * @returns {CheerioStatic} - Loaded HTML content in the form of a Cheerio instance.
 * @throws {Error} - If an error occurs during parsing.
 */
const getDocument = (html) => {
	try {
		const loadedHtml = cheerio.load(html);
		return loadedHtml;
	} catch (e) {
		throw new Error(e);
	}
};

/**
 * Parses raw JSON data extracted from HTML content.
 *
 * @param {string} raw - Raw JSON data in string format.
 * @returns {Object|null} - Parsed video data or null if parsing fails.
 */
const parseVideoData = (raw) => {
	if (!raw) return null;
	try {
		const data = JSON.parse(raw);
		const { ItemModule } = data;
		const rep = getFirstProperty(ItemModule);
		const { video } = rep;
		return video;
	} catch (e) {
		return null;
	}
};

/**
 * Validates whether the given URL is a valid TikTok URL.
 *
 * @param {string} url - URL to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
const validateURL = (url) => {
	if (!url || typeof url !== "string") return false;
	return REGEX.test(url);
};

/**
 * Retrieves video information from a TikTok URL by fetching HTML content
 * and parsing relevant data.
 *
 * @param {string} url - TikTok URL.
 * @returns {Object|null} - Video data object or null if retrieval fails.
 * @throws {Error} - If an error occurs during the process.
 */
async function getInfo(url) {
	try {
		if (!validateURL(url)) throw new Error("Invalid url");

		const html = await handleHtml(url);
		if (!html) return null;

		let rawJSON;
		try {
			const $ = getDocument(html);
			const test = $("#SIGI_STATE");
			rawJSON = test[0].children[0].data;

			const data = parseVideoData(rawJSON);
			return data;
		} catch (e) {
			throw new Error("Error parsing JSON data: " + e.message);
		}
	} catch (error) {
		throw new Error("Error in getInfo: " + error.message);
	}
}

/**
 * Retrieves video information and downloads a TikTok video from a URL.
 *
 * @param {string} url - TikTok URL.
 * @returns {Promise<Buffer>} - Video data in Buffer format.
 * @throws {Error} - If an error occurs during the process.
 */
async function download(url) {
	return new Promise(async (resolve, reject) => {
		try {
			const data = await getInfo(url);
			if (!data || !data.playAddr)
				return reject(new Error("Couldn't resolve stream."));

			const downloadUrl = data.playAddr;

			const config = {
				headers: {
					Referer: url,
					"User-Agent": USER_AGENT,
				},
				responseType: "arraybuffer",
			};

			instance(downloadUrl, config)
				.then((res) => {
					resolve(res);
				})
				.catch((err) => reject(err));
		} catch (e) {
			console.log("Error:", e);
			reject("Couldn't resolve stream.");
		}
	});
}

/**
 * Downloads TikTok videos and extracts relevant information.
 * @async
 * @function downloadTikTokVideos
 */
(async () => {
	// List of TikTok video URLs to process
	const urls = ["replace with desired URL", "replace with desired URL"];

	// Query parameters to be added to the URLs
	const queryParams =
		"is_from_webapp=1&sender_device=pc&web_id=replace with desired web ID";

	// Arrays for mapping days of the week and months
	const daysOfWeek = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	// Iterate through each URL
	for (const [index, url] of urls.entries()) {
		// Modify the URL by adding query parameters
		let modifiedUrl = url;
		if (url.includes("?")) {
			modifiedUrl += "&" + queryParams;
		} else {
			modifiedUrl += "?" + queryParams;
		}

		try {
			// Fetch video data
			const resp = await download(modifiedUrl);
			const { data } = resp;

			// Extract relevant information from the HTML
			const $ = getDocument(await handleHtml(url));
			const usernameElement = $('span[data-e2e="browse-username"]');
			const username = usernameElement.text();
			const cleanedUsername = username.replace(/[^\w]+/g, "");
			const newFileName = `${cleanedUsername}_video_${index}.mp4`;

			// Write video data to a file
			fs.writeFileSync(`replace with desired storage path${newFileName}`, data);

			// Extract JSON data and video details
			/**
			 * Extracts JSON data and video details from the HTML content.
			 *
			 * @param {string} rawJSON - Raw JSON data extracted from the HTML content.
			 * @returns {Object} - Video details extracted from the JSON data.
			 */
			const parsedJSON = JSON.parse(rawJSON);
			const itemModule = parsedJSON.ItemModule;

			// Get the video ID from the item module
			const videoId = Object.keys(itemModule)[0];
			const videoData = itemModule[videoId];

			// Extract specific video information
			const { desc, createTime, author, music, stats, video } = videoData;
			const { title } = music;
			const { diggCount, shareCount, commentCount, playCount, collectCount } =
				stats;
			const { duration } = video;

			// Format creation date
			const createdDate = new Date(createTime * 1000);
			const formattedDate = `${daysOfWeek[createdDate.getDay()]}, ${
				months[createdDate.getMonth()]
			} ${createdDate.getDate()} ${createdDate.getFullYear()} ${createdDate.getHours()}:${createdDate.getMinutes()} WIB`;

			// Example to Print extracted information
			// console.log("====================================");
			// console.log(`🎵 TikTok by     : ${author}`);
			// console.log(`📝 Title         : ${desc}`);
			// console.log("\n📊 Statistics:");
			// console.log(`   - ❤️ Like      : ${diggCount}`);
			// console.log(`   - 🔄 Share     : ${shareCount}`);
			// console.log(`   - 💬 Comment   : ${commentCount}`);
			// console.log(`   - ▶️ Play       : ${playCount}`);
			// console.log(`   - 📌 Bookmark  : ${collectCount}`);
			// console.log(`\n🕒 Video Duration: ${duration} Seconds`);
			// console.log(`\n📅 Created on    : ${formattedDate}`);
			// console.log("\n🎶 Music:");
			// console.log(`   🎵 ${title}`);
			// console.log("====================================");
			// console.log("✅ Download completed for video by", author);
		} catch {
			console.log("Error while downloading", url);
		}
	}
})();
