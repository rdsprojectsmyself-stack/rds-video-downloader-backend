const youtubedl = require("youtube-dl-exec");
const path = require("path");
const fs = require("fs");

const binaryPath = path.join(__dirname, "..", "bin", "yt-dlp");

async function ensureYTDLP() {
  if (!fs.existsSync(binaryPath)) {
    console.log("yt-dlp binary missing. Downloading...");

    const { execSync } = require("child_process");
    try {
      execSync(
        `curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ${binaryPath}`
      );
      execSync(`chmod +x ${binaryPath}`);
      console.log("yt-dlp downloaded & made executable.");
    } catch (err) {
      console.error("Error downloading yt-dlp:", err);
    }
  }
}

exports.download = async (url, output) => {
  await ensureYTDLP();

  return youtubedl(url, {
    output,
    binaryPath,
    noCheckCertificates: true,
    noWarnings: true,
    format: "mp4",
  });
};
