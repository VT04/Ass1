import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid'
import { ImCross } from "react-icons/im";
import axios from '../../api/axios.js';
import './VideoSection.css'

function VideoSection({ className }) {

  const [files, setFiles] = useState([])

  const onDrop = useCallback((UploadedFiles) => {
    if (UploadedFiles?.length) {
      setFiles(previousFiles => {
        const newFiles = UploadedFiles.filter(newFile =>
          !previousFiles.some(existingFile => existingFile.name === newFile.name)
        );
        return [
          ...previousFiles,
          ...newFiles.map(file =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          )
        ];
      });
    }

  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
  })

  const removeFile = name => {
    setFiles(files => files.filter(file => file.name !== name))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!files?.length) {
      alert("No files uploaded")
      return
    }

    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    try {
      const response = await axios.post('/upload', formData)

      if (response.status === 200) {
        alert('Successful Upload')
      } else {
        alert('some other error')
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        const errorMessage = `Error ${err.response.status}: ${err.response.data.message}`;
        alert(errorMessage);
      } else {
        console.error(err);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className='videosection-form'>
      <div {...getRootProps({
        className: className,
        style: {
          borderWidth: '3000px',
          height: '200px',
          borderRadius: '20px'
        }
      })}>
        <input {...getInputProps()} />
        <div>
          <ArrowUpTrayIcon />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag Or drop</p>
          )}
        </div>
      </div>

      <section className='below-videosection'>
        <div className='videosection-buttons'>
          {/* Removed the Remove all files button */}
          <button
            type='submit'
            className='upload-button'
          >
            Upload Files
          </button>
        </div>

        <h3 className='uploaded-title'>Uploaded Files</h3>
        <ul className='uploaded-list'>
          {files.map(file => (
            <li className='uploaded-card'>
              <button
                type='button'
                className='x-button'
                onClick={() => removeFile(file.name)}
              >
                <ImCross className='text-danger' style={{ fontSize: '16px' }} />
              </button>
              <p className=''>
                {file.name}
              </p>
            </li>
          ))}
        </ul>


      </section>
    </form>
  )
}

export default VideoSection