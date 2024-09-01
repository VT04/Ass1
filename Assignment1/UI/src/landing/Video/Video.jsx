import React, { useEffect, useState } from 'react'
import axios from '../../api/axios'
import Menu from '../../el/Menu/Menu'
import VideoCard from '../../el/VideoCard/VideoCard'
import "./Video.css"
import { Link } from 'react-router-dom'


function Video() {

    const [myVideos, setMyVideos] = useState([])

    const fetchUserVideos = () => {
        axios.get("/myVideos", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                setMyVideos(response.data)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
    }

    useEffect(() => {
        fetchUserVideos()
    }, [])



    return (
        <div className='section'>
            <Menu />

            <div className='content'>
                {myVideos.length > 0 ? (
                    myVideos.map((video, index) => (
                        <VideoCard
                            key={index}
                            props={video}
                            fetchUserVideos={fetchUserVideos}
                        />
                    ))
                ) : (
                    <div className='no-content'>
                        <p className="no-vid"><Link to="/upload"><span>Upload Videos</span></Link></p>

                    </div>
                )}
            </div>
        </div>
    )
}

export default Video