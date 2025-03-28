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

// Importing required modules
const fs = require("fs");
const axios = require("axios").default;
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar, formatDate } = require("tough-cookie");
const cheerio = require("cheerio");

// User-agent string used for making HTTP requests
const USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const REGEX = /^https?:\/\/(www\.|vm\.)?(tiktok\.com)\/?(.*)$/;

// Creating a CookieJar instance to handle cookies across requests
const cookieJar = new CookieJar();

// Creating an Axios instance with cookie jar support
const instance = wrapper(
    axios.create({
        withCredentials: true,
        jar: cookieJar,
    })
);

// Headers to be used in HTTP requests
const headers = {
    "User-Agent": "TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet",
};
/**
 * Fetches HTML content from the specified URL using Axios.
 *
 * @param {string} url - The URL to fetch HTML content from.
 * @returns {Promise<string>} - A Promise resolving to the HTML content.
 * @throws {Error} - Throws an error if the request fails.
 */
const handleHtml = async (url) => {
    try {
        // Make an HTTP request to fetch HTML content
        let res = await instance(url, {
            headers: {
                "User-Agent": USER_AGENT,
            },
        });
        const { data } = res;
        return data;
    } catch (e) {
        // Throw an error if the request fails
        throw new Error(e);
    }
};

/**
 * Loads HTML content into Cheerio for easier manipulation and traversal.
 *
 * @param {string} html - The HTML content to load into Cheerio.
 * @returns {CheerioStatic} - A Cheerio instance representing the loaded HTML.
 * @throws {Error} - Throws an error if loading the HTML into Cheerio fails.
 */
const getDocument = (html) => {
    try {
        // Load HTML content into Cheerio
        const loadedHtml = cheerio.load(html);
        return loadedHtml;
    } catch (e) {
        // Throw an error if loading into Cheerio fails
        throw new Error(e);
    }
};

/**
 * Downloads images from the specified URLs and saves them to the filesystem.
 *
 * @param {string} url - The base URL for referring purposes.
 * @param {string} imageId - The unique identifier for the image.
 * @param {string[]} imageUrlPath - Array of image URLs to download.
 * @param {string} tanggalan - The date information associated with the images.
 * @param {string} authorUniqueId - The unique identifier of the author.
 * @throws {Error} - Throws an error if downloading images fails.
 */
const downloadImages = async (
    url,
    imageId,
    imageUrlPath,
    tanggalan,
    authorUniqueId
) => {
    try {
        // Set headers for image download request
        const headers = {
            Referer: url,
            "User-Agent": USER_AGENT,
        };

        // Iterate through each image URL
        for (let i = 0; i < imageUrlPath.length; i++) {
            const imageUrl = imageUrlPath[i];
            // Make an HTTP request to download the image
            const response = await instance(imageUrl, {
                headers,
                responseType: "arraybuffer",
            });

            const { data } = response;

            // Format date for creating a unique filename
            const formattedDate = formatUploadDate(tanggalan);
            const newFileName = `${authorUniqueId}_image_${formattedDate}_${imageId}.jpg`;

            // Specify the relative directory where images will be saved
            const relativeDirectory = "./tiktok-images/";

            // Create the directory if it doesn't exist
            if (!fs.existsSync(relativeDirectory)) {
                fs.mkdirSync(relativeDirectory);
            }

            // Save the image to the filesystem in the specified directory
            fs.writeFileSync(`${relativeDirectory}${newFileName}`, data);
        }
    } catch (error) {
        // Log an error message if downloading images fails
        console.error("Error while downloading images", url, error);
    }
};
/**
 * Formats a timestamp into a string representing the upload date.
 *
 * @param {number} timestamp - The timestamp to format.
 * @returns {string} - The formatted date string (DDMMYYYY).
 */
const formatUploadDate = (timestamp) => {
    const createdDate = new Date(timestamp * 1000);
    const formattedDate = `${createdDate
        .getDate()
        .toString()
        .padStart(2, "0")}${(createdDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${createdDate.getFullYear()}`;
    return formattedDate;
};

/**
 * Generates a unique filename for a TikTok video based on video data.
 *
 * @param {Object} videoData - The TikTok video data.
 * @returns {string} - The generated filename.
 */
const generateVideoFileName = (videoData) => {
    const authorUniqueId = videoData.authorUniqueId;
    const uploadDate = formatUploadDate(videoData.createTime);
    const videoId = videoData.videoId;

    return `${authorUniqueId}_video_${uploadDate}_${videoId}.mp4`;
};

/**
 * Downloads TikTok videos from the provided URL.
 *
 * @param {string} url - The TikTok video URL.
 * @returns {Promise} - A Promise representing the downloaded video.
 * @throws {Error} - Throws an error if the download process fails.
 */
const download = async (url) => {
    try {
        // Get the video URL information
        const videoUrl = await getInfo(url);

        // Pause execution for 2000 milliseconds (2 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (!videoUrl) {
            // Resolve the video URL if not already available
            const resolvedVideoUrl = await resolveVideoUrl(url);

            if (!resolvedVideoUrl) {
                throw new Error("Couldn't resolve stream. No video URL found.");
            }

            // Download the video and get the video buffer
            const videoBuffer = await downloadVideo(resolvedVideoUrl, url);

            // Generate the video filename
            const fileName = generateVideoFileName(resolvedVideoUrl);

            const targetFolder = "./tiktok-videos";

            // Check if the target folder exists, create it if not
            if (!fs.existsSync(targetFolder)) {
                fs.mkdirSync(targetFolder, {
                    recursive: true,
                });
            }

            // Save the video to the filesystem in the "tiktok-videos" folder
            fs.writeFileSync(`${targetFolder}/${fileName}`, videoBuffer);

            console.log(
                `✅ Video downloaded for ${resolvedVideoUrl.authorUniqueId}_${resolvedVideoUrl.videoId}`
            );

            return resolvedVideoUrl;
        }

        // Configure headers for video download request
        const config = {
            headers: {
                Referer: url,
                "User-Agent": USER_AGENT,
            },
            responseType: "arraybuffer",
        };

        // Make an HTTP request to download the video
        const videoResponse = await instance(videoUrl, config);
        return videoResponse;
    } catch (error) {
        // Log an error message if the download process fails
        console.error("Error while processing", url, error);
        throw error;
    }
};
/**
 * Retrieves TikTok video information from the provided URL.
 *
 * @param {string} url - The TikTok video URL.
 * @returns {Promise<Object>} - A Promise representing the video information.
 * @throws {Error} - Throws an error if retrieving video information fails.
 */
const getInfo = async (url) => {
    try {
        // Validate the URL
        if (!validateURL(url)) {
            throw new Error("Invalid URL provided");
        }

        // Fetch HTML content from the TikTok video URL
        const html = await handleHtml(url);

        // Throw an error if HTML content retrieval fails
        if (!html) {
            throw new Error(
                "Failed to retrieve HTML content from the provided URL"
            );
        }

        let loadedHtml;

        // Retry loop with timeout
        let retryCount = 5; // Number of retries
        while (retryCount > 0) {
            try {
                // Parse HTML content using Cheerio
                loadedHtml = await getDocument(html); // Use await here

                // If parsing is successful, exit the loop
                if (loadedHtml) {
                    break;
                }
            } catch (error) {
                console.error(`Error while parsing HTML: ${error.message}`);
            }

            retryCount--; // Decrement retry count
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait before trying again
        }

        // Throw an error if HTML parsing fails after retries
        if (!loadedHtml) {
            throw new Error("Failed to parse HTML content");
        }

        // Find the script tag containing JSON data
        const jsonDataElement = loadedHtml(
            "#__UNIVERSAL_DATA_FOR_REHYDRATION__"
        );

        // Throw an error if JSON data is not found
        if (!jsonDataElement || jsonDataElement.length === 0) {
            throw new Error("Unable to find JSON data in HTML document");
        }

        // Extract JSON data from the script tag
        const rawJSON = jsonDataElement[0]?.children[0].data;

        // Throw an error if extracting JSON data fails
        if (!rawJSON) {
            throw new Error("Failed to extract JSON data from HTML");
        }

        // Parse the JSON data to get video information
        const data = parseVideoData(rawJSON);

        // Throw an error if parsing video information fails
        if (!data) {
            throw new Error(
                "Failed to extract video information from JSON data"
            );
        }

        return data;
    } catch (error) {
        // Log an error message if getInfo fails
        console.error("Error in getInfo:", error.message);
        throw new Error("Failed to retrieve video information");
    }
};

/**
 * Resolves the TikTok video URL using the provided URL.
 *
 * @param {string} url - The TikTok video URL.
 * @returns {Promise<Object>} - A Promise representing the resolved video URL and additional information.
 * @throws {Error} - Throws an error if resolving video URL fails.
 */
const resolveVideoUrl = async (url) => {
    try {
        const API_URL = `https://api-tiktok-downloader.vercel.app/api/v4/download?url=${url}`;

        const response = await instance(API_URL, {
            method: "GET",
            headers: headers,
        });

        const data = response.data;
        if (data.status === "success" && data.result.type === "video") {
            return {
                resolvedVideoUrl: data.result.video.playAddr[0],
                authorUniqueId: data.result.author.username,
                videoId: data.result.id,
                createTime: data.result.createTime,
            };
        } else {
            throw new Error("Failed to get video information");
        }
    } catch (error) {
        console.error("Error in resolveVideoUrl:", error.message);
        throw error;
    }
};
/**
 * Downloads TikTok video from the resolved video URL.
 *
 * @param {string} resolvedVideoUrl - The resolved video URL.
 * @param {string} url - The original TikTok video URL.
 * @returns {Promise<Buffer>} - A Promise representing the downloaded video buffer.
 * @throws {Error} - Throws an error if downloading video fails.
 */
const downloadVideo = async (resolvedVideoUrl, url) => {
    try {
        // Make an HTTP request to download the video
        const videoResponse = await instance(resolvedVideoUrl, {
            headers: {
                Referer: url,
                "User-Agent": USER_AGENT,
            },
            responseType: "arraybuffer",
        });

        // Return the video buffer
        return videoResponse.data;
    } catch (error) {
        // Log an error message if downloading video fails
        console.error("Error while downloading video:", error.message);
        throw error;
    }
};

/**
 * Validates whether the provided string is a valid TikTok video URL.
 *
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
const validateURL = (url) => {
    // Check if the URL matches the TikTok video URL regex
    if (!url || typeof url !== "string") return false;
    return REGEX.test(url);
};

/**
 * Parses raw JSON data to extract video information.
 *
 * @param {string} raw - The raw JSON data to parse.
 * @returns {Promise<string>} - A Promise representing the resolved video URL.
 * @throws {Error} - Throws an error if parsing JSON data fails.
 */
const parseVideoData = async (raw) => {
    if (!raw) {
        // Throw an error if no raw JSON data is provided
        throw new Error("No raw JSON data provided");
    }

    try {
        // Pause execution for 2000 milliseconds (2 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Parse the raw JSON data
        const data = JSON.parse(raw);

        // Extract the resolved video URL from the JSON data
        const playAddrUrlList =
            data?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.itemInfo
                ?.itemStruct?.video?.bitrateInfo?.[0]?.PlayAddr?.UrlList;

        // Check if the JSON structure is valid and contains sufficient data
        if (!playAddrUrlList || playAddrUrlList.length < 2) {
            throw new Error(
                "Invalid JSON structure. PlayAddr.UrlList not found or insufficient data."
            );
        }

        // Return the resolved video URL
        return playAddrUrlList[1];
    } catch (e) {
        // Log an error message if parsing JSON data fails
        console.error("Error parsing JSON data:", e.message);
        throw new Error("Failed to parse JSON data");
    }
};
/**
 * Resolves the TikTok photo URL using the provided URL.
 *
 * @param {string} url - The TikTok photo URL.
 * @returns {Promise<Object>} - A Promise representing the resolved photo URL and additional information.
 * @throws {Error} - Throws an error if resolving photo URL fails.
 */
const resolvePhotoUrl = async (url) => {
    try {
        const API_URL = `https://api-tiktok-downloader.vercel.app/api/v4/download?url=${url}`;
        const response = await instance(API_URL, {
            method: "GET",
            headers: headers,
        });

        const data = response.data;
        if (data.status === "success" && data.result.type === "image") {
            return {
                images: data.result.images,
                authorUniqueId: data.result.author.username,
                createTime: data.result.createTime,
                id: data.result.id,
            };
        } else {
            throw new Error("Failed to get photo information");
        }
    } catch (error) {
        console.error("Error in resolvePhotoUrl:", error.message);
        throw error;
    }
};

/**
 * Asynchronous function to download images or videos from TikTok.
 * Iterates through a list of TikTok video URLs, fetches video details
 * from the TikTok API, and downloads either images or videos based on
 * the content type of the TikTok post.
 */
(async () => {
    // Array of TikTok video URLs
    const urls = ["https://www.tiktok.com/@username/video/1234567890123456789"];
    // Additional query parameters for TikTok URL
    const queryParams =
        "?is_from_webapp=1&sender_device=pc&web_id=7221493350775866882";

    // Loop through each TikTok URL
    for (const url of urls) {
        let modifiedUrl = url;
        // Append query parameters to the URL
        if (url.includes("?")) {
            modifiedUrl += "&" + queryParams;
        } else {
            modifiedUrl += "?" + queryParams;
        }

        try {
            // Check if the URL is for a photo or video
            if (url.includes("/photo/")) {
                try {
                    const photoData = await resolvePhotoUrl(url);
                    const authorUniqueId = photoData.authorUniqueId;
                    const tanggalan = photoData.createTime;
                    const imageId = photoData.id;

                    // Download each image in the array
                    for (let i = 0; i < photoData.images.length; i++) {
                        const imageUrl = photoData.images[i];
                        const imageIndex = i + 1;
                        await downloadImages(
                            url,
                            `${imageId}_${imageIndex}`,
                            [imageUrl],
                            tanggalan,
                            authorUniqueId
                        );
                        console.log(
                            `✅ Image ${imageIndex} downloaded for ${authorUniqueId}`
                        );
                    }
                } catch (error) {
                    console.error("Error while processing photo:", error);
                }
            } else {
                // If the URL is for a video, download the video
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const resp = await download(modifiedUrl);
                const { data } = resp;

                // Video download logic
                const $ = getDocument(await handleHtml(url));
                const jsonDataElement = $(
                    "#__UNIVERSAL_DATA_FOR_REHYDRATION__"
                );
                await new Promise((resolve) => setTimeout(resolve, 3000));

                // Check if JSON data is present in the HTML document
                if (jsonDataElement && jsonDataElement.length > 0) {
                    const rawJSON = jsonDataElement[0]?.children?.[0]?.data;

                    // Check if raw JSON data is present
                    if (rawJSON) {
                        try {
                            // Parse JSON data
                            const parsedJSON = JSON.parse(rawJSON);
                            const videoDetail =
                                parsedJSON?.__DEFAULT_SCOPE__?.[
                                    "webapp.video-detail"
                                ];

                            // Check if videoDetail is present in parsed JSON
                            if (videoDetail) {
                                const itemInfo = videoDetail?.itemInfo;
                                const itemStruct = itemInfo?.itemStruct;
                                const author = itemStruct?.author;

                                // Check if author information is present
                                if (author) {
                                    const authorName =
                                        author?.uniqueId ?? "UnknownAuthor";
                                    const formattedDate = formatUploadDate(
                                        itemStruct.createTime
                                    );
                                    const newFileName = `${authorName}_video_${formattedDate}_${itemStruct.id}.mp4`;

                                    // Check if video data is defined and write to file
                                    if (data !== undefined) {
                                        const targetFolder = "./tiktok-videos";

                                        // Check if the target folder exists, create it if not
                                        if (!fs.existsSync(targetFolder)) {
                                            fs.mkdirSync(targetFolder, {
                                                recursive: true,
                                            });
                                        }

                                        // Save the video to the filesystem in the "tiktok-videos" folder
                                        fs.writeFileSync(
                                            `${targetFolder}/${newFileName}`,
                                            data
                                        );
                                        console.log(
                                            `✅ Video downloaded for ${authorName}_${itemStruct.id}`
                                        );
                                    } else {
                                        console.error(
                                            "Error: Video data is undefined."
                                        );
                                    }
                                } else {
                                    console.error(
                                        "Error: 'author' is undefined."
                                    );
                                }
                            } else {
                                console.error(
                                    "Error: 'videoDetail' is undefined."
                                );
                            }
                        } catch (error) {
                            console.error(
                                "Failed to parse JSON:",
                                error.message
                            );
                        }
                    } else {
                        console.error("Failed to extract JSON data from HTML");
                    }
                } else {
                    // console.error("Unable to find JSON data in HTML document");
                }
            }
        } catch (error) {
            console.error("Error while processing", url, error);
        }
    }
})();
