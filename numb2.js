const ytdl = require('ytdl-core');
const fs = require('fs');

function downloadVideoToMP3(videoURL, outputFileName) {
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

module.exports = downloadVideoToMP3;
