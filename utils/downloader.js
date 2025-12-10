const ytdlp = require('yt-dlp-exec');
const path = require('path');

async function download(url, format = 'mp4') {
  const outputPath = path.join('/tmp', '%(title)s.%(ext)s');

  return ytdlp(url, {
    output: outputPath,
    format: format === 'mp3' ? 'bestaudio' : 'best',
    mergeOutputFormat: format,
  });
}

module.exports = { download };
