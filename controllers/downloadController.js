const downloader = require('../utils/downloader');
const db = require('../database/db');

exports.handleDownload = async (req, res) => {
    const { url, quality, format, audioOnly, audioBitrate } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Log intent to DB (fire and forget)
    // Implicit platform detection logic (simplified for logging)
    let platform = 'Unknown';
    if (url.includes('youtube') || url.includes('youtu.be')) platform = 'YouTube';
    else if (url.includes('instagram')) platform = 'Instagram';
    else if (url.includes('facebook') || url.includes('fb.watch')) platform = 'Facebook';
    else if (url.includes('tiktok')) platform = 'TikTok';
    else if (url.includes('twitter') || url.includes('x.com')) platform = 'X/Twitter';
    else if (url.includes('vimeo')) platform = 'Vimeo';

    db.run(
        'INSERT INTO downloads (url, platform, quality, format) VALUES (?, ?, ?, ?)',
        [url, platform, audioOnly ? 'Audio' : quality, audioOnly ? 'mp3' : format],
        (err) => {
            if (err) console.error('DB Log Error:', err);
        }
    );

    try {
        const subprocess = await downloader.download(url, quality, format, audioOnly, audioBitrate);

        // Determine filename and contentType
        const ext = audioOnly ? 'mp3' : (format || 'mp4');
        const filename = `download.${ext}`;

        let contentType = 'application/octet-stream';
        if (audioOnly) contentType = 'audio/mpeg';
        else if (ext === 'mp4') contentType = 'video/mp4';
        else if (ext === 'mkv') contentType = 'video/x-matroska';
        else if (ext === 'avi') contentType = 'video/x-msvideo';
        else if (ext === 'mov') contentType = 'video/quicktime';
        else if (ext === 'wmv') contentType = 'video/x-ms-wmv';
        else if (ext === 'flv') contentType = 'video/x-flv';

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', contentType);

        // Pipe stdout to response
        subprocess.stdout.pipe(res);

        // Handle errors during streaming
        subprocess.on('error', (err) => {
            console.error('Subprocess error:', err);
            // Can't send JSON if headers already sent, but we can log it.
        });

    } catch (err) {
        console.error('Download setup error:', err);
        res.status(500).json({ error: 'Failed to start download process' });
    }
};
