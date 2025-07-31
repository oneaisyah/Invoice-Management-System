const { Storage } = require('@google-cloud/storage');
const { GoogleAuth } = require('google-auth-library');
const fs = require('fs').promises;

const projectId = process.env.ocr_project_id;
const serviceAccountKeyFile = process.env.ocr_service_account_key_file;

const storage = new Storage({
  projectId,
  keyFilename: serviceAccountKeyFile,
});


bucketName = "ocr_test1234"

async function uploadFile(localFilePath, remoteFileName) {
  try {
    const bucket = storage.bucket(bucketName);
    const res = await bucket.upload(localFilePath, {
      destination: remoteFileName,
    });
    fs.unlink(localFilePath, (err) => {
      if (err) {
        throw err;
      }

      console.log("Delete File successfully.");
    });
    console.log(`File ${localFilePath} uploaded to ${remoteFileName}.`);
    return res[0].metadata.mediaLink;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
}

async function getSignedUrl(bucketName, fileName, expiration = '1h') {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  // Options for generating the signed URL
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + (parseInt(expiration) * 60 * 60 * 1000), // URL expires in 'expiration' hours
  };

  try {
    const [signedUrl] = await file.getSignedUrl(options);
    console.log('Download URL:', signedUrl);
    return signedUrl;
  } catch (err) {
    console.error('Error generating signed URL:', err);
    throw err;
  }
}

async function listBucketFiles() {
  try {
    // Get the list of files in the bucket
    const [files] = await storage.bucket(bucketName).getFiles();

    // Display the list of file names
    files.forEach((file) => {
      console.log(`File: ${file.name}`);
    });
  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  }
}

//upload file into bucket
// uploadFile(bucketName, 'enric_head.jpg', 'enric_head.jpg');
// //retrieve file from bucket using signedURL
// getSignedUrl(bucketName, 'iggy_head.jpg');
//listBucketFiles();
module.exports = { uploadFile, getSignedUrl };