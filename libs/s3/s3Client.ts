// lib/s3Client.js
import AWS from 'aws-sdk';

const s3AccessKey = process.env.S3_ACCESS_KEY || "";
const s3SecretKey = process.env.S3_SECRET_KEY || "";
const s3BucketName = process.env.S3_BUCKET_NAME || "";
const s3Endpoint = process.env.S3_ENDPOINT || "";

if (!s3AccessKey || !s3SecretKey || !s3BucketName || !s3Endpoint) {
  throw new Error("Missing required S3 configuration");
}

// Initialize the S3 client once
const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(s3Endpoint),
  accessKeyId: s3AccessKey,
  secretAccessKey: s3SecretKey,
  region: process.env.S3_REGION,
  s3ForcePathStyle: s3Endpoint?.includes('localhost'),  // MinIO uses path-style
  signatureVersion: 'v4',
  sslEnabled: process.env.S3_USE_SSL === 'true',  // Enable SSL in production
});

// Export the S3 client to use in API routes
export default s3;
