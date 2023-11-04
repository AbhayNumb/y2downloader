const puppeteer = require('puppeteer');
const ytdl = require('ytdl-core');
const fs = require('fs');

async function downloadVideoToMP3(videoURL, outputFileName) {
  const audioStream = ytdl(videoURL, {
    filter: 'audioonly',
    quality: 'highestaudio',
    format: 'mp3',
  });

  audioStream.pipe(fs.createWriteStream(outputFileName));

  audioStream.on('end', () => {
    console.log('Audio download complete.');
  });

  audioStream.on('error', (err) => {
    console.error('Error downloading audio:', err);
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const url = "https://youtube.com/playlist?list=PLom77DeON9xj6UfLKxzTh5YJrgino8Az0&si=w8NthjQp5CYi0cFE";
  await page.goto(url);

  // Wait for the page to load completely (you can adjust the waiting time as needed)
  await page.waitForSelector('ytd-playlist-video-renderer');

  // Extract data from the page
  const data = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('ytd-playlist-video-renderer'));
    return items.map(item => {
      const title = item.querySelector('h3').innerText;
      const videoLink = item.querySelector('a').getAttribute('href');
      return { title, videoLink };
    });
  });

  for (const video of data) {
    // Construct a unique output file name based on the video title
    const titleForFileName = video.title.replace(/[^\w\s]/g, ''); // Remove special characters
    const outputFileName = `${titleForFileName}.mp3`;

    // Call the downloadVideoToMP3 function for each video
    await downloadVideoToMP3(`https://www.youtube.com${video.videoLink}`, outputFileName);

    console.log(`Downloading audio for: ${video.title}`);
  }

  await browser.close();
})();
