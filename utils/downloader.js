const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to the yt-dlp binary installed by youtube-dl-exec
const ytDlpPath = path.resolve(__dirname, '../node_modules/youtube-dl-exec/bin/yt-dlp.exe');

/**
 * Download video from any supported platform using yt-dlp.
 * @param {string} url - Video URL.
 * @param {string} quality - Desired quality (e.g., '480p', '720p', '1080p', '1440p', '2160p').
 * @param {string} format - Desired container format ('mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv').
 * @param {boolean} audioOnly - If true, return audio-only MP3.
 * @param {string} audioBitrate - Audio bitrate in kbps (e.g., '320', '256', '128').
 * @returns {ChildProcess} - The spawned subprocess.
 */
async function download(url, quality, format, audioOnly, audioBitrate) {
    if (!fs.existsSync(ytDlpPath)) {
        throw new Error(`yt-dlp binary not found at ${ytDlpPath}`);
    }

    const args = [
        url,
        '--no-check-certificates',
        '--no-warnings',
        '--prefer-free-formats',
        '--add-header', 'referer:youtube.com',
        '--add-header', 'user-agent:googlebot',
        '--output', '-' // Output to stdout
    ];

    if (audioOnly) {
        args.push('--extract-audio');
        args.push('--audio-format', 'mp3');
        if (audioBitrate) {
            args.push('--audio-quality', `${audioBitrate}K`);
        }
    } else {
        // Map quality string to integer height
        const qualityMap = {
            '2160p (4K)': 2160,
            '1440p (2K)': 1440,
            '1080p': 1080,
            '720p': 720,
            '480p': 480,
            '360p': 360
        };
        const h = qualityMap[quality] || (parseInt(quality) || 720);

        // Format selection: Best video <= requested height + best audio, OR best combined <= requested height
        // We use 'best[height<=H]' as fallback if split selection fails or merges aren't possible without external tools
        args.push('--format', `bestvideo[height<=${h}]+bestaudio/best[height<=${h}]`);

        // Recode if specific format requested and it's not the default
        if (format) {
            args.push('--recode-video', format);
        } else {
            args.push('--recode-video', 'mp4'); // Default
        }
    }

    console.log(`Spawning yt-dlp from: "${ytDlpPath}" with args:`, args);
    const subprocess = spawn(ytDlpPath, args);

    subprocess.stderr.on('data', (data) => {
        console.error(`yt-dlp stderr: ${data}`);
    });

    subprocess.on('error', (err) => {
        console.error('Failed to start yt-dlp process:', err);
    });

    return subprocess;
}

module.exports = { download };
