const path = require('path');
const fs = require('fs');
const archiver = require('archiver'); // Package to create ZIP archives
const videoend = require('../ends/video');
const ffmpeg = require('../ffmpeg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userend = require('../ends/user.js');
const saltRounds = 10;
const JWT_SECRET = 'JWT_SECRET'; // Should be stored in .env file
const uploadVideo = async (req, res) => {
    if (!req.files || !req.files.files) {
        return res.status(400).json({ message: 'No files were uploaded' });
    }

    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    const uploadPromises = files.map(file => {
        const uploadPath = path.join(__dirname, '..', 'uploads', file.name);
        const thumbnailPath = path.join(__dirname, '..', 'thumbnails', `${path.basename(file.name, path.extname(file.name))}.png`);

        // Create uploads directory if it does not exist
        if (!fs.existsSync(path.dirname(uploadPath))) {
            fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
        }

        if (!fs.existsSync(path.dirname(thumbnailPath))) {
            fs.mkdirSync(path.dirname(thumbnailPath), { recursive: true });
        }

        // Generate URLs for accessing files
        const fileUrl = `/uploads/${file.name}`;
        const thumbnailUrl = `/thumbnails/${path.basename(thumbnailPath)}`;


        return new Promise((resolve, reject) => {
            file.mv(uploadPath, async (err) => {
                if (err) {
                    reject({ message: 'File Upload Failed', error: err });
                }

                // Extract author from JWT
                const token = req.cookies.token;

                if (!token) {
                    return res.status(401).send('No token provided');
                }

                jwt.verify(token, JWT_SECRET, async (err, user) => {
                    if (err)
                        return reject({ message: 'Invalid token' })

                    ffmpeg.getVideoMetadata(uploadPath, (err, metadata) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error getting video duration', error: err });
                        }

                        ffmpeg.captureThumbnail(uploadPath, thumbnailPath, 5, (thumbnailErr, thumbnail) => {
                            if (thumbnailErr) {
                                return res.status(500).json({ message: 'Error getting thumbnail', error: err });
                            }

                            // Create video metadata
                            const video = {
                                title: file.name,
                                filename: file.name,
                                filepath: fileUrl,
                                mimetype: file.mimetype,
                                size: file.size,
                                duration: metadata.duration || 0,
                                author: user.userID, // Extracted from JWT
                                thumbnail: thumbnailUrl,
                                codec: metadata.codec
                            };

                            try {
                                videoend.addVideo(video, (err, videoID) => {
                                    if (err)
                                        return reject({ message: 'Failed to save video metadata', error: err });
                                    resolve({ message: 'File uploaded and metadata saved', file: file.name });
                                });
                            } catch (error) {
                                reject({ message: 'Failed to save video metadata', error });
                            }
                        })
                    })
                })
            })
        })
    })

    Promise.all(uploadPromises)
        .then(results => res.json(results))
        .catch(error => res.status(500).json(error));
}

const authorVideo = (req, res) => {
    let token = req.cookies.token; // Assuming the JWT is stored in a cookie named 'token'

    if (!token) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        token = authHeader.split(' ')[1]; // Extract the token from the 'Bearer <token>' format
    }

    // Decode the JWT to get the authorId
    let authorID;
    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Replace 'your_secret_key' with your actual secret key
        authorID = decoded.userID; // Assuming the authorId is stored in the token payload
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    // Call the model function to get videos by the author
    videoend.getVideosByAuthor(authorID, (err, videos) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }


        res.json(videos);
    });
}

const getVideo = (req, res) => {
    const videoId = req.params.id;

    videoend.getVideoById(videoId, (err, video) => {
        if (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.json(video)
    })
}

// Delete a video of specific id
const deleteVideo = (req, res) => {
    const videoId = req.params.id;

    videoend.getVideoById(videoId, (err, video) => {
        if (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const videoPath = path.join(__dirname, '..', 'uploads', video[0].filename);
        const thumbnailPath = path.join(__dirname, '..', 'thumbnails', `${path.basename(video[0].filename, path.extname(video[0].filename))}.png`);

        // Delete the video file and thumbnail
        fs.unlink(videoPath, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete video file', error: err.message });
            }

            fs.unlink(thumbnailPath, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Failed to delete thumbnail file', error: err.message });
                }

                // Proceed to delete the video metadata
                videoend.deleteVideo(videoId, (err, wasDeleted) => {
                    if (err) {
                        return res.status(500).json({ message: 'Server error', error: err.message });
                    }

                    if (!wasDeleted) {
                        return res.status(404).json({ message: 'Video not found' });
                    }

                    res.status(200).json({ message: 'Video deleted successfully' });
                });
            });
        });
    });
};

const reformatVideo = (req, res) => {
    const { format: newFormat, codec: newCodec, videoData } = req.body;
    const format = getFormatFromMimeType(videoData.mimetype);

    if (!newFormat || !newCodec || !videoData || !videoData.filepath || !format || !videoData.codec) {
        return res.status(400).json({ message: 'Missing required parameters.' });
    }

    // Use the filepath directly from videoData
    const inputPath = path.join(__dirname, '..', videoData.filepath);
    const outputDirectory = path.join(__dirname, '..', 'output_directory');
    const outputFilename = `${path.basename(videoData.filename, path.extname(videoData.filename))}.${newFormat}`;
    const outputPath = path.join(outputDirectory, outputFilename);



    // Call ffmpeg.reformatVideo with the parameters
    ffmpeg.reformatVideo(
        inputPath,
        outputPath,
        format,
        videoData.codec,
        newFormat,
        newCodec,
        (err, outputPath) => {
            if (err) {
                return res.status(500).json({ message: 'Error reformatting video', error: err });
            }
            res.status(200).json({ message: 'Video reformatted successfully', outputPath });
        }
    );
};

// Define a mapping of MIME types to file formats
const mimeTypeToFormat = {
    'video/mp4': 'mp4',
    'video/avi': 'avi',
    'video/mkv': 'mkv',
    'video/quicktime': 'mov',
    'video/x-ms-wmv': 'wmv',
    'video/x-flv': 'flv',
    'video/webm': 'webm',

};

// Function to get the format from MIME type
const getFormatFromMimeType = (mimeType) => {
    return mimeTypeToFormat[mimeType] || null;
};

// Function to download video
const downloadVideo = (req, res) => {
    const outputDirectory = path.join(__dirname, '..', 'output_directory');

    fs.readdir(outputDirectory, (err, files) => {


        // Filter for video files based on possible extensions
        const videoFile = files.find(file => Object.values(mimeTypeToFormat).some(ext => file.endsWith(`.${ext}`)));



        const filePath = path.join(outputDirectory, videoFile);

        // Extract the MIME type from the file extension
        const fileExtension = path.extname(videoFile).substring(1); // Get file extension without the dot
        const mimeType = Object.keys(mimeTypeToFormat).find(key => mimeTypeToFormat[key] === fileExtension);


        // Set the Content-Type header based on the MIME type
        res.setHeader('Content-Type', mimeType);

        // Use res.download to send the file to the client with the correct filename
        res.download(filePath, videoFile, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error downloading video file', error: err });
            }

            // Optionally delete the file after download
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting video file:', err);
                }
            });
        });
    });
};


// Function to register a new user
const register_user = (req, res) => {
    const { username, email, password } = req.body;

    // Hash Password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        //Save the user with the hashed password
        userend.createUser(username, email, hashedPassword, (err, userID) => {
            if (err) {
                if (err.message === 'Username already exists') {
                    return res.status(409).json({ message: 'Username already exists' }); // 409 Conflict
                }
                return res.status(500).json({ error: err.message }); // 500 Internal Server Error
            }

            // Successful registration
            res.status(201).json({ message: 'User created successfully', userID });
        })
    })
}

// Function to log in a user
const login_user = (req, res) => {
    const { username, password } = req.body;

    userend.getUserByUsername(username, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!user) {
            // No such username found in database
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the provided password with the hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!isMatch) {
                // Wrong Password
                return res.status(401).json({ message: "Invalid Credentials" });
            }

            // Generating JWT
            const token = jwt.sign(
                {
                    userID: user.id,
                    username: user.username
                },
                JWT_SECRET,
                {
                    expiresIn: '78h'
                }
            );

            // Setting JWT as cookie
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });

            // Successful login
            res.json({ message: "Login Successful", userID: user.id, token });
        })
    })
}

// Function to log out a user
const logout_user = (req, res) => {
    // Clear the token cookie
    res.clearCookie('token', {
        httpOnly: true, // Ensure it matches the cookie attributes used when setting it
        secure: process.env.NODE_ENV === 'production', // Use the same secure setting
        sameSite: 'Strict' // Match the sameSite attribute
    });

    // Send a response to indicate successful logout
    res.status(200).json({ message: 'Logged out successfully' });
};



module.exports = {
    register_user,
    login_user,
    logout_user,
    uploadVideo,
    authorVideo,
    getVideo,
    deleteVideo,
    reformatVideo,
    downloadVideo,
}