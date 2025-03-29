# TikTok Content Downloader 🚀

A powerful Node.js command-line tool for downloading TikTok videos and images with ease and reliability.

## ✨ Features

-   Download TikTok videos in high quality
-   Support for TikTok photo posts (multiple images)
-   Intelligent fallback system with API backup
-   Organized file storage with meaningful naming
-   Automatic retry mechanism
-   Detailed console logging
-   Cross-platform compatibility

## 🔧 Prerequisites

-   Node.js (version 14 or higher)
-   NPM (version 6 or higher)
-   Internet connection

## 📦 Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/RehanDias/tiktok-downloader-console.git
    ```

2. Enter the project directory:

    ```bash
    cd tiktok-downloader-console
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

## 🚀 Quick Start

1. Open `config/constants.js` and verify your download paths:

    ```javascript
    VIDEO_DIR: "downloads/videos",
    IMAGE_DIR: "downloads/images"
    ```

2. Edit `index.js` and add your TikTok URLs:

    ```javascript
    const urls = [
        "https://www.tiktok.com/@user1/video/1234567890123456789",
        "https://www.tiktok.com/@user2/video/2345678901234567890",
        "https://www.tiktok.com/@user3/photo/3456789012345678901",
        "https://www.tiktok.com/@user4/photo/4567890123456789012",
    ];
    ```

3. Run the downloader:
    ```bash
    node index.js
    ```

## 📝 Output Format

### Videos

```
{username}_video_{date}_{videoId}.mp4
```

### Images

```
{username}_image_{date}_{imageId}_{index}.jpg
```

## ⚙️ Advanced Configuration

You can customize the following in `config/constants.js`:

-   Download directories
-   User agents
-   API endpoints
-   Retry attempts
-   Timeout values

## 🔍 Troubleshooting

If you encounter issues:

1. Verify your internet connection
2. Check TikTok URL validity
3. Ensure write permissions in download directories
4. Update Node.js to latest version
5. Clear npm cache and reinstall dependencies

## ⚠️ Important Notes

-   Use responsibly and respect TikTok's terms of service
-   Some videos may be protected and undownloadable
-   Keep the tool updated as TikTok's structure changes frequently
-   Consider rate limiting for bulk downloads

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📱 Connect With Developer

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by Rehan Dias
</div>
