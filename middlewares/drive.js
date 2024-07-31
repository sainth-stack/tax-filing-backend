import axios from 'axios';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Configure OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  '573823221354-d175srri1ta9un581atkp7b9qenst32u.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground'
);

// Set your refresh token
const YOUR_REFRESH_TOKEN = '1//04A6f_vSLmW65CgYIARAAGAQSNwF-L9IrkvKq2Ho4bvcAfZthrEReUrVzRDNuB3HZGSfBVTM6AqE62YUyZSkUoR5_UEJLZ_ih688';
oAuth2Client.setCredentials({ refresh_token: YOUR_REFRESH_TOKEN });

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: '573823221354-d175srri1ta9un581atkp7b9qenst32u.apps.googleusercontent.com',
      client_secret: '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',
      refresh_token: YOUR_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    });
    const newAccessToken = response.data.access_token;
    oAuth2Client.setCredentials({ access_token: newAccessToken });
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
    throw new Error('Error refreshing access token');
  }
};

// Function to upload file to Google Drive
export const uploadFileToDrive = async (filePath) => {
  try {
    await refreshAccessToken(); // Refresh the access token before making the API call

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

    const fileMetadata = {
      name: path.basename(filePath),
    };
    const media = {
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error.response ? error.response.data : error.message);
    throw new Error('Error uploading file to Google Drive');
  }
};

export default { uploadFileToDrive };
