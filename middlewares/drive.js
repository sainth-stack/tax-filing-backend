import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your access key or use environment variables
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your secret key or use environment variables
  region: process.env.AWS_REGION, // Replace with your AWS region or use environment variables
});

// Create S3 service object
const s3 = new AWS.S3();

// Function to upload file to S3 bucket
export const uploadFileToDrive = async (filePath) => {
  try {
    // Read the file content
    const fileContent = fs.readFileSync(filePath);

    // Set up S3 upload parameters
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // Your bucket name
      Key: path.basename(filePath), // File name you want to save as in S3
      Body: fileContent,
      ContentType: "application/octet-stream", // Optional: set content type
    };

    // Uploading files to the bucket
    const response = await s3.upload(params).promise();

    // Log or return the uploaded file information (e.g., file URL)
    console.log(`File uploaded successfully. ${response.Location}`);
    return {
      key: response.Key,
      url: response.Location, // File URL
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error.message);
    throw new Error("Error uploading file to S3");
  }
};

export default { uploadFileToDrive };
