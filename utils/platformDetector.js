const url = require('url');

function detect(videoUrl) {
    const parsed = new URL(videoUrl);
    const hostname = parsed.hostname.toLowerCase();
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        return 'youtube';
    }
    if (hostname.includes('instagram.com')) {
        // Reels or regular video URLs contain /reel/ or /p/
        if (parsed.pathname.includes('/reel/') || parsed.pathname.includes('/p/')) {
            return 'instagram';
        }
    }
    if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) {
        return 'facebook';
    }
    if (hostname.includes('tiktok.com')) {
        return 'tiktok';
    }
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        return 'twitter';
    }
    if (hostname.includes('vimeo.com')) {
        return 'vimeo';
    }
    // Default fallback
    return 'unknown';
}

module.exports = { detect };
