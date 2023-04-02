const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;

const s3 = new S3Client({
  accessKeyId,
  secretAccessKey,
  region: bucketRegion,
});

const createPresignedUrlWithClient = async ({ client, bucket, key }) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 43200 });
};

async function getFileList() {
  const input = {
    Bucket: bucketName,
  };
  const command = new ListObjectsV2Command(input);
  const response = await s3.send(command);

  const results = await Promise.all(response.Contents.map(async ({ Key }) => {
    const src = await createPresignedUrlWithClient({
      client: s3,
      bucket: bucketName,
      key: Key,
    });
    return { title: Key, src };
  }));
  return results;
}

module.exports = {
  s3,
  getFileList,
};
