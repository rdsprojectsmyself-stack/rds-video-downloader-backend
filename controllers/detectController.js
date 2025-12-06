const platformDetector = require('../utils/platformDetector');

exports.detectPlatform = async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    try {
        const platform = platformDetector.detect(url);

        // Fetch metadata
        const youtubedl = require('youtube-dl-exec');
        let metadata = {};

        try {
            const output = await youtubedl(url, {
                dumpSingleJson: true,
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
                addHeader: ['referer:youtube.com', 'user-agent:googlebot']
            });
            metadata = {
                title: output.title,
                thumbnail: output.thumbnail,
                duration: output.duration_string || output.duration
            };
        } catch (metaErr) {
            console.error('Metadata fetch failed:', metaErr.message);
            // Proceed with just platform if metadata fails
        }

        return res.json({ platform, ...metadata });
    } catch (err) {
        console.error('Detection error:', err);
        return res.status(500).json({ error: 'Failed to detect platform' });
    }
};
