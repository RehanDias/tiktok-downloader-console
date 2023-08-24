/**
 * This script is used to download TikTok videos and extract information from them.
 * It utilizes Axios for making HTTP requests, Cheerio for parsing HTML content,
 * and Tough-Cookie for managing cookies. The script takes a list of TikTok video URLs,
 * fetches the video data, and downloads the video files while extracting relevant information.
 *
 * Note: Make sure to replace placeholders like "isi sesuai dengan..." with actual values.
 */

const fs = require("fs");
const axios = require("axios").default;
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");
const cheerio = require("cheerio");

// User agent to be used for HTTP requests
const USER_AGENT = "replace with desired user agent";

// Regular expression to validate TikTok URLs
const REGEX = /^https?:\/\/(www\.|vm\.)?(tiktok\.com)\/?(.*)$/;

// Create a cookie jar and an instance of Axios with cookie support
const cookieJar = new CookieJar();
const instance = wrapper(
  axios.create({
    withCredentials: true,
    jar: cookieJar,
  })
);

/**
 * Fetches HTML content from a URL using Axios.
 *
 * @param {string} url - The URL to fetch the HTML from.
 * @returns {Promise<string>} - The HTML content.
 * @throws {Error} - If an error occurs during the request.
 */
const handleHtml = async (url) => {
  try {
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
 * @param {string} html - The HTML content to load.
 * @returns {CheerioStatic} - The loaded HTML content as a Cheerio instance.
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
 * Parses raw JSON data extracted from the HTML content.
 *
 * @param {string} raw - The raw JSON data as a string.
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
 * Validates whether a given URL is a valid TikTok URL.
 *
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
const validateURL = (url) => {
  if (!url || typeof url !== "string") return false;
  return REGEX.test(url);
};

/**
 * Retrieves video information and downloads the video from a TikTok URL.
 *
 * @param {string} url - The TikTok URL.
 * @returns {Promise<Buffer>} - The video data as a Buffer.
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
 * Main function to gather video information and download TikTok videos.
 */
(async () => {
  const urls = [
    "replace with desired URL",
    "replace with desired URL",
  ];
  const queryParams =
    "is_from_webapp=1&sender_device=pc&web_id=replace with desired web ID";
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

  for (const [index, url] of urls.entries()) {
    // Construct the modified URL with query parameters
    let modifiedUrl = url;
    if (url.includes("?")) {
      modifiedUrl += "&" + queryParams;
    } else {
      modifiedUrl += "?" + queryParams;
    }

    try {
      // Download the video data
      const resp = await download(modifiedUrl);
      const { data } = resp;

      // Extract relevant information from the HTML
      const $ = getDocument(await handleHtml(url));
      const usernameElement = $('span[data-e2e="browse-username"]');
      const username = usernameElement.text();
      const cleanedUsername = username.replace(/[^\w]+/g, "");
      const newFileName = `${cleanedUsername}_video_${index}.mp4`;

      // Write the video data to a file
      fs.writeFileSync(
        `replace with desired storage path${newFileName}`,
        data
      );

      // Extract JSON data and video details
      const rawJSON = $("#SIGI_STATE")[0].children[0].data;
      const parsedJSON = JSON.parse(rawJSON);
      const itemModule = parsedJSON.ItemModule;
      const videoId = Object.keys(itemModule)[0];
      const videoData = itemModule[videoId];
      const { desc, createTime, author, music, stats, video } = videoData;
      const { title } = music;
      const {
        diggCount,
        shareCount,
        commentCount,
        playCount,
        collectCount,
      } = stats;
      const { duration } = video;

      // Format creation date
      const createdDate = new Date(createTime * 1000);
      const formattedDate = `${daysOfWeek[createdDate.getDay()]}, ${
        months[createdDate.getMonth()]
      } ${createdDate.getDate()} ${createdDate.getFullYear()} ${createdDate.getHours()}:${createdDate.getMinutes()} WIB`;

      // Print extracted information
      console.log("====================================");
      console.log(`🎵 TikTok by     : ${author}`);
      console.log(`📝 Title         : ${desc}`);
      console.log("\n📊 Statistics:");
      console.log(`   - ❤️ Like      : ${diggCount}`);
      console.log(`   - 🔄 Share     : ${shareCount}`);
      console.log(`   - 💬 Comment   : ${commentCount}`);
      console.log(`   - ▶️ Play       : ${playCount}`);
      console.log(`   - 📌 Bookmark  : ${collectCount}`);
      console.log(`\n🕒 Video Duration: ${duration} Seconds`);
      console.log(`\n📅 Created on    : ${formattedDate}`);
      console.log("\n🎶 Music:");
      console.log(`   🎵 ${title}`);
      console.log("====================================");
      console.log("✅ Download completed for video by", author);
    } catch {
      console.log("Error while downloading", url);
    }
  }
})();
