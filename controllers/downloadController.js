const { download } = require('../utils/downloader');

exports.handleDownload = async (req, res) => {
  try {
    const { url, format } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    await download(url, format);

    res.json({
      success: true,
      message: 'Download started successfully'
    });
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({
      error: 'Download failed',
      details: err.message
    });
  }
};
