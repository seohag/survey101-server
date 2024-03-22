const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

exports.getS3Client = () => {
  const clientConfig = {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  };

  const s3Client = new S3Client(clientConfig);

  return s3Client;
};

exports.getListObjectsCommand = (bucketName, prefix, delimiter) => {
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
    Delimiter: delimiter || "/",
  });

  return listObjectsCommand;
};

exports.getGetObjectCommand = (bucketName, key) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getObjectCommand;
};

exports.getPutObjectCommand = (bucketName, key, body, contentType) => {
  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  return putObjectCommand;
};

exports.getDeleteObjectCommand = (bucketName, key) => {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return deleteObjectCommand;
};
