const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const path = require('path')

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// Function to get the duration of a video
const getVideoMetadata = (filePath, callback) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
            return callback(err);
        }
        // Duration is in seconds
        const duration = metadata?.format?.duration;
        const codec = metadata.streams[0].codec_name;
        callback(null, { duration, codec });
    });
};

// Function to capture thumbnail of video
const captureThumbnail = (videoPath, thumbnailPath, timeInSeconds = 5, callback) => {
    ffmpeg(videoPath)
        .screenshots({
            timestamps: [timeInSeconds],
            filename: path.basename(thumbnailPath),
            folder: path.dirname(thumbnailPath),
            size: '1920x1080' // You can specify the thumbnail size here
        })
        .on('end', () => {
            callback(null, thumbnailPath);
        })

}

// Function to change format and codec of video and save it in a new directory
const reformatVideo = (inputPath, outputPath, currentFormat, currentCodec, newFormat, newCodec, callback) => {
    // Check if the current format and codec are the same as the requested output format and codec
    if (currentFormat.toLowerCase() === newFormat.toLowerCase()) {
        // If format and codec are the same, just copy the file
        fs.copyFile(inputPath, outputPath, (err) => {
            if (err) {
                console.error('Error copying file:', err);
                callback(err);
            }
        });
    } else {
        // Perform format and codec conversion
        ffmpeg(inputPath)
            .output(outputPath) // The output file path, including the file extension
            .format(newFormat.toLowerCase()) // Ensure format name is in lowercase
            .on('progress', (progress) => {
                console.log(`Processing: ${progress.percent.toFixed(2)}% done`);
            })
            .on('end', () => {
                console.log('Processing finished successfully.');
                callback(null, outputPath);
            })

            .run();
    }
}

const { exec } = require('child_process');

// exec(`${ffmpegPath} -formats`, (err, stdout, stderr) => {
//   if (err) {
//     console.error('Error executing ffmpeg:', err);
//     return;
//   }
//   console.log(stdout); // This will list all supported codecs
// });

module.exports = {
    getVideoMetadata,
    captureThumbnail,
    reformatVideo,
};