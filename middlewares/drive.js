
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Configure OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  '573823221354-d175srri1ta9un581atkp7b9qenst32u.apps.googleusercontent.com',
  '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',
  'https://talantspotify/auth/login'
);

oAuth2Client.setCredentials({ refresh_token: 'YOUR_REFRESH_TOKEN' });

export const uploadFileToDrive = async (filePath) => {
  try {
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
    console.error('Error uploading file to Google Drive:', error);
    throw new Error('Error uploading file to Google Drive');
  }
};

export default uploadFileToDrive;
