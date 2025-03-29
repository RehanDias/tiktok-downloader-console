/**
 * Extracts video data from TikTok JSON response
 *
 * This function parses the raw JSON data from TikTok's response and extracts
 * relevant video information including author details, video URLs, and metadata.
 *
 * @param {string} rawJSON - Raw JSON string from TikTok's response
 * @returns {Object|null} Object containing video data with the following properties:
 *   @property {string} authorUniqueId - Author's unique identifier
 *   @property {string} authorNickname - Author's display name
 *   @property {string} videoId - Unique identifier of the video
 *   @property {number} createTime - Video creation timestamp
 *   @property {string} videoUrl - URL for video playback
 *   @property {string} description - Video description/caption
 * @throws {Error} Throws error if required data is missing or invalid
 */
const extractVideoDataFromJson = (rawJSON) => {
    try {
        const parsedJSON = JSON.parse(rawJSON);
        const videoDetail =
            parsedJSON?.__DEFAULT_SCOPE__?.["webapp.video-detail"];

        if (!videoDetail) {
            throw new Error("Video data not found in JSON response");
        }

        const itemInfo = videoDetail.itemInfo;
        const itemStruct = itemInfo?.itemStruct;

        if (!itemStruct) {
            throw new Error("Item structure not found in JSON response");
        }

        const author = itemStruct.author;
        const video = itemStruct.video;

        if (!author || !video) {
            throw new Error("Author or video data missing in response");
        }

        // Extract video URL from various possible locations
        let videoUrl = null;
        if (video.bitrateInfo && video.bitrateInfo.length > 0) {
            const playAddr = video.bitrateInfo[0].PlayAddr;
            if (playAddr && playAddr.UrlList && playAddr.UrlList.length > 0) {
                videoUrl = playAddr.UrlList[0];
            }
        }

        if (!videoUrl && video.playAddr) {
            videoUrl = video.playAddr;
        }

        if (!videoUrl) {
            throw new Error("Video URL not found in response");
        }

        return {
            authorUniqueId: author.uniqueId,
            authorNickname: author.nickname,
            videoId: itemStruct.id,
            createTime: itemStruct.createTime,
            videoUrl: videoUrl,
            description: itemStruct.desc,
        };
    } catch (error) {
        console.error(`Error extracting video data: ${error.message}`);
        return null;
    }
};

module.exports = {
    extractVideoDataFromJson,
};
