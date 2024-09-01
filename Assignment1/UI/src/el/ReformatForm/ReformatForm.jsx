import React, { useState } from 'react';
import { FaArrowsRotate, FaDownload } from 'react-icons/fa6';
import './ReformatForm.css';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const ReformatForm = ({ videoData }) => {
    const [selectedFormat, setSelectedFormat] = useState('mp4');
    const [isDownloadVisible, setDownloadVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onFormatChange = (event) => {
        setSelectedFormat(event.target.value);
    };

    const initiateReformat = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            const response = await axios.post('/reformat', {
                format: selectedFormat,
                codec: 'libx264', // Assuming a fixed codec for now
                videoData: videoData,
            });

            if (response.status === 200) {
                setLoading(false);
                setDownloadVisible(true);
                alert('Reformatting successful!');
            } else {
                alert('Unexpected server response.');
            }
        } catch (error) {
            setLoading(false);

            const errorMessage = error.response?.data?.message
                ? `Error ${error.response.status}: ${error.response.data.message}`
                : 'An error occurred during reformatting.';

            alert(errorMessage);
            console.error(error);
        }
    };

    const triggerDownload = async (event) => {
        event.preventDefault();

        const baseFilename = videoData.filename.replace(/\.[^/.]+$/, '');
        const newFilename = `${baseFilename}.${selectedFormat}`;

        try {
            const response = await axios.post('/download', {}, { responseType: 'blob' });

            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', newFilename);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);

                alert('Download successful!');
                navigate('/videos');
            } else {
                alert('Unexpected server response.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message
                ? `Error ${error.response.status}: ${error.response.data.message}`
                : 'An error occurred during download.';

            alert(errorMessage);
            console.error(error);
        }
    };

    return (
        <div className="reformat-form-container">
            <form className="reformat-form">
                <label htmlFor="format" className="reformat-label">Select video format:</label>
                <select
                    id="format"
                    name="format"
                    className="reformat-select"
                    onChange={onFormatChange}
                    value={selectedFormat}
                >
                    <option value="mp4" defaultValue>
                        MP4
                    </option>
                    <option value="avi">AVI</option>
                    <option value="mov">MOV</option>
                    <option value="flv">FLV</option>
                    <option value="webm">WebM</option>
                    <option value="mpeg">MPEG</option>
                    <option value="3gp">3GP</option>
                    <option value="ogg">Ogg</option>
                </select>
            </form>
            <div className="reformat-form-buttons">
                <button type="submit" className="reformat-button" onClick={initiateReformat}>
                    <span>Reformat</span> <FaArrowsRotate />
                </button>
                {isDownloadVisible && (
                    <button type="button" className="reformat-button" onClick={triggerDownload}>
                        <span>Download</span> <FaDownload />
                    </button>
                )}
            </div>
            {isLoading && <span className="loading-text">Reformatting...</span>}
        </div>
    );
};

export default ReformatForm;