Assignment 1 - Web Server - Response to Criteria
================================================

Overview
------------------------------------------------

- **Name:** Vu Tran
- **Student number:** n11365978
- **Application name:** Video Transcoder
- **Two line description:** Web app for videos uploading, convert into different formats and download. Using Docker for containing  and integrates with AWS for managing images.




Core criteria
------------------------------------------------

### Docker image

- **ECR Repository name:** vutran11365978s
- **Video timestamp:** 2:37
- **Relevant files:**
  - /ui/Dockerfile
  - /int/Dockerfile 

### Docker image running on EC2

- **EC2 instance ID:** i-0a995bddf89c5cd5e
- **Video timestamp:** 2:40

### User login functionality

- **One line description:** Registration and Login by using JSON web token then store user's data in cookie
- **Video timestamp:** 1:03
- **Relevant files:**
  - /int/routes/userRoute.js
  - /int/man/man.js 

### User dependent functionality

- **One line description:** Each users can only view their videos
- **Video timestamp:** 2:06
- **Relevant files:**
  - /int/routes/videoRoute.js 
  - /int/man/man.js 
  - /int/ends/video.js 

### Web client

- **One line description:** React Web Application
- **Video timestamp:** 1:03 - 2:25
- **Relevant files:**
  - /UI/src

### REST API

- **One line description:** 2 endpoints, 1 for user 1 for video
- **Video timestamp:** 4:09
- **Relevant files:**
  - /int/routes
  - /int/man
  - /int/ends

### Two kinds of data

#### First kind

- **One line description:** Video Metadata
- **Type:** Structured, SQLite3
- **Rationale:**  Lightweight fast response to queries about video metada
- **Video timestamp:** 0:09
- **Relevant files:**
  - /int/database.js
  - /int/ends

#### Second kind

- **One line description:** Video File
- **Type:** Unstructured, Blob Storage
- **Rationale:** Videos size are hard to deal with SQL database
- **Video timestamp:** 0:26
- **Relevant files:**
  - /int/man/man.js 
  - /int/uploads 

### CPU intensive task

- **One line description:** Transcoding with ffmpeg
- **Video timestamp:** 1:47
- **Relevant files:**
  - /int/ffmpeg.js
  - /int/routes/videoRoute.js 
  - /int/man/man.js 

Additional criteria
------------------------------------------------

### Extensive REST API features

- **One line description:** Authentication and Transcoding Video
- **Video timestamp:** 1:03
- **Relevant files:**
  - /int/routes
  - /int/man


### Extensive web client features

- **One line description:** File Drag and Drop, Interactive Menu
- **Video timestamp:** 1:41 and 2:03
- **Relevant files:**
  - /UI/src/el/Menu/Menu.jsx
  - /UI/src/el/VideoCard/VideoCard.jsx
  - /UI/src/el/VideoSection/VideoSection.jsx


### Additional kinds of data

- **One line description:** Thumbnails
- **Video timestamp:** 1:50
- **Relevant files:**
  - /int/ffmpeg.js 
  - /int/thumbnails 


