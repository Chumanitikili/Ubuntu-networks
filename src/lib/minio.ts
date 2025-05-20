import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const bucketName = process.env.MINIO_BUCKET || 'callcenter';

export const storage = {
  async initialize() {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName);
      console.log(`Bucket ${bucketName} created successfully`);
    }
  },

  async uploadFile(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    await minioClient.putObject(bucketName, fileName, fileBuffer, {
      'Content-Type': contentType,
    });
    return `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
  },

  async getFile(fileName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      minioClient.getObject(bucketName, fileName, (err, dataStream) => {
        if (err) {
          reject(err);
          return;
        }

        dataStream.on('data', (chunk) => chunks.push(chunk));
        dataStream.on('end', () => resolve(Buffer.concat(chunks)));
        dataStream.on('error', reject);
      });
    });
  },

  async deleteFile(fileName: string): Promise<void> {
    await minioClient.removeObject(bucketName, fileName);
  },

  getFileUrl(fileName: string): string {
    return `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
  },
};

export default minioClient; 