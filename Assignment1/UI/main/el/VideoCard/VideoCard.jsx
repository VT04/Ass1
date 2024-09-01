import React, { useState, useEffect } from 'react';
import './VideoCard.css';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { baseURL } from '../../Baseurl';

const VideoCard = ({ props, fetchUserVideos }) => {
    const [videoData, setVideoData] = useState(null);
    const [thumbnail, setThumbnail] = useState('');

    const apiBase = baseURL;

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
        if (props) {
            setVideoData(props);
            setThumbnail(encodeURI(`${apiBase}${props.thumbnail}`));
        }
    }, [props]);

    if (!videoData) {
        return <div>Loading...</div>;
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`/delete/${videoData.id}`);
            fetchUserVideos();
        } catch (err) {
            const errorMessage = err.response?.data?.message
                ? `Error ${err.response.status}: ${err.response.data.message}`
                : 'An error occurred while deleting.';
            alert(errorMessage);
            console.error(err);
        }
    };

    return (
        <div className="card">
            {thumbnail && <img className="card-video-img" src={thumbnail} alt="Video Thumbnail" />}
            <h1 className="card-video-name">{videoData.filename}</h1>
            <div className="card-details">
                <p><strong>Size:</strong> {formatBytes(videoData.size)}</p>
                <p><strong>Duration:</strong> {formatTime(videoData.duration)} mins</p>
                <p><strong>File Type:</strong> {videoData.mimetype}</p>
            </div>
            <div className="card-buttons">
                <Link to={`/reformat/${videoData.id}`}>
                    <button>
                        <span className="reformat-text">Reformat</span>
                    </button>
                </Link>
                <button onClick={handleDelete}>
                    <span className="delete-text">Delete</span>
                </button>
            </div>
        </div>
    );
};

export default VideoCard;