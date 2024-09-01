import React, { useEffect, useState } from 'react';
import ReformatForm from '../../el/ReformatForm/ReformatForm';
import './Reformat.css';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { baseURL } from '../../Baseurl';

const Reformat = () => {
    const { id } = useParams();
    const [videoDetails, setVideoDetails] = useState(null);
    const [thumbnailSource, setThumbnailSource] = useState('');

    const apiBaseUrl = baseURL;

    const formatBytes = (bytes) => {
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const response = await axios.get(`/video/${id}`);
                setVideoDetails(response.data[0]);
            } catch (error) {
                console.error('Error fetching video data:', error);
            }
        };

        fetchVideoData();
    }, [id]);

    useEffect(() => {
        if (videoDetails) {
            setThumbnailSource(encodeURI(`${apiBaseUrl}${videoDetails.thumbnail}`));
        }
    }, [videoDetails, apiBaseUrl]);

    if (!videoDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="reformat-bg">
            <div className="video-wrapper">
                {thumbnailSource && <img className="video-thumbnail" src={thumbnailSource} alt="Video Thumbnail" />}
                <h1 className="video-name">{videoDetails.filename}</h1>
                <div className="video-details">
                    <p>
                        <strong>Size:</strong> {formatBytes(videoDetails.size)}
                    </p>
                    <p>
                        <strong>Duration:</strong> {formatTime(videoDetails.duration)} mins
                    </p>
                    <p>
                        <strong>File Type:</strong> {videoDetails.mimetype}
                    </p>
                    <p>
                        <strong>Codec Type:</strong> {videoDetails.codec}
                    </p>
                    <p>
                        <strong>Upload Date:</strong> {videoDetails.uploadDate}
                    </p>
                </div>
            </div>
            <ReformatForm videoData={videoDetails} />
        </div>
    );
};

export default Reformat;