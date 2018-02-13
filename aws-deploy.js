const s3 = require( 's3' );

/* Create a new S3 client */
const client = s3.createClient({
  maxAsyncS3: 20,
  s3RetryCount: 3,
  s3RetryDelay: 1000,
  multipartUploadThreshold: 20971520,
  multipartUploadSize: 15728640,
  s3Options: {
    accessKeyId: process.env.ALYSON_DEPLOY_S3_KEY,
    secretAccessKey: process.env.ALYSON_DEPLOY_S3_SECRET,
    region: 'ap-southeast-2',
  },
});

/* Determine which S3 bucket to push to depending on branch we are on */
const bucketName = process.env.ALYSON_DEPLOY_S3_BUCKET;

console.log( `Deploying to ${bucketName}` );

/* Create uploader parameters */
const params = {
  localDir: './build/',
  deleteRemoved: true,
  s3Params: {
    Bucket: bucketName,
    Prefix: '',
  },
};

/* Create the uploaded */
const uploader = client.uploadDir( params );

/* Log progress and errors */
uploader.on( 'error', err => {
  console.error( 'Unable to sync:', err.stack );
});

uploader.on( 'progress', () => {
  console.log( 'Progress', uploader.progressAmount, uploader.progressTotal );
});

uploader.on( 'end', () => {
  console.log( 'Deployment complete' );
});
