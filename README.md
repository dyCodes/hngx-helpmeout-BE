# HNGx - HelpMeOut API

A REST API designed for a Chrome Extension that allows users to record their screen.

**Link:** [https://hngx-helpmeout-api.onrender.com/](https://hngx-helpmeout-api.onrender.com/)

**API Documentation:** [View API Documentation](https://documenter.getpostman.com/view/28222605/2s9YJc23FA)

<br/>

# API Endpoints

1. **Get Video by ID**

   - **Endpoint:** `GET /api/video/:id`
   - **Description:** Retrieve a video by its unique ID.

2. **Upload Video**

   - **Endpoint:** `POST /api/upload`
   - **Description:** Upload a video and save details to database.

3. **Get Video Transcript**

   - **Endpoint:** `GET /api/transcribe/:id`
   - **Description:** Retrieve the transcript of a video by its ID.

4. **Get All Videos**

   - **Endpoint:** `GET /api/videos`
   - **Description:** Retrieve a list of all available videos.

5. **Delete Video**
   - **Endpoint:** `DELETE /api/video/:id`
   - **Description:** Delete a video by its ID.

<br/>

# Setup and Usage

Follow these steps to set up and use the HNGx - HelpMeOut API:

**1. Clone the Repository:**

```
git clone [repository-url]
```

**2. Install Dependencies from package.json:**

```
npm install
```

**3. Create a .env File and Set Database Connection:**
Create a `.env` file in the project root and set the MongoDB server connection string and Deepgram API key:

```
MONGODB_CONNECTION = "mongodb://localhost:27017/[your-database-name]"
DEEPGRAM_API_KEY= "[your-deepgram-api-key]"
```

**4. Start the API:**
Run the following command to start the API server:

```
npm start
```

**5. Access the API:**
Navigate to [http://localhost:8000](http://localhost:8000) to access the API.
