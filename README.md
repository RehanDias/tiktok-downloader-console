
# TikTok Video and Image Downloader 🚀

## Overview

TikTok Video and Image Downloader is a Node.js script designed to effortlessly download TikTok videos and images. With this script, you can quickly fetch content from TikTok URLs and save them to your local machine.

## Features

- ✨ Download TikTok videos and images
- 📦 Easy installation and setup
- 🔄 Retry mechanism for robust HTML parsing
- 📅 Automatic file naming with upload date
- 🎉 Support for both video and image URLs

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

1. **Clone the repository:**

   ```bash
   https://github.com/RehanDias/tiktok-downloader-console.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd tiktok-downloader-console
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Run the script:**

   ```bash
   node tiktok-downloader.js
   ```

## Usage

1. Modify the `urls` array in the script to include the TikTok video or image URLs you want to download.

   ```javascript
   const urls = [
    "https://www.tiktok.com/@user1/video/1234567890123456789",
    "https://www.tiktok.com/@user2/video/2345678901234567890",
    "https://www.tiktok.com/@user3/photo/3456789012345678901",
    "https://www.tiktok.com/@user4/photo/4567890123456789012",
    // Add more TikTok URLs as needed
     ];
   ```

2. Execute the script to download the specified content.

## File Naming

- Videos: `{authorUniqueId}_video_{formattedDate}_{videoId}.mp4`
- Images: `{authorUniqueId}_image_{formattedDate}_{imageIndex}.jpg`

## Examples

```bash
# Download videos and images from predefined TikTok URLs
node tiktok-downloader.js
```

### Important Notes ⚠️

- This script was created for educational purposes and should be used responsibly and in compliance with TikTok's terms of service.
- TikTok's website structure or APIs may change over time, which could potentially break this script. Regular updates may be required to ensure its functionality.

**Note:** Before using the script, make sure to replace the placeholder values in the `urls` array in the code according to your desired TikTok video or image URLs. Configure any other settings as needed. Happy TikTok video and image downloading! 🎉


<div align="center">
  <a href="https://www.instagram.com/rehandiazz/" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Instagram&logo=instagram&label=&color=E4405F&logoColor=white&labelColor=&style=for-the-badge" height="35" alt="instagram logo"  />
  </a>
  <a href="https://www.hackerrank.com/magearcanist" target="_blank">
    <img src="https://img.shields.io/static/v1?message=HackerRank&logo=hackerrank&label=&color=2EC866&logoColor=white&labelColor=&style=for-the-badge" height="35" alt="hackerrank logo"  />
  </a>
  <a href="paypal.me/rehandiasp" target="_blank">
    <img src="https://img.shields.io/static/v1?message=PayPal&logo=paypal&label=&color=00457C&logoColor=white&labelColor=&style=for-the-badge" height="35" alt="paypal logo"  />
  </a>
</div>

###

## License 📜

[MIT](https://github.com/RehanDias/tiktok-downloader-console/blob/main/LICENSE)
