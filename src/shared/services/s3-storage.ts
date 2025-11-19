import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { FileData, FileStorage } from '../types/storage';
import config from 'config';

export class S3StorageService implements FileStorage {
  private client: S3Client;
  constructor() {
    this.client = new S3Client({
      region: config.get('aws.region'),
      credentials: {
        accessKeyId: config.get('aws.accessKey'),
        secretAccessKey: config.get('aws.keySecret'),
      },
    });
  }

  async upload(data: FileData): Promise<void> {
    const imageFolderPath = String(config.get('aws.imagePath'));
    const params = {
      Bucket: String(config.get('aws.bucket')),
      Key: `${imageFolderPath}/${data.filename}`,
      Body: data.fileData,
      ContentType: data.contentType,
    };

    await this.client.send(new PutObjectCommand(params));
  }
  async delete(filename: string): Promise<void> {
    const imageFolderPath = String(config.get('aws.imagePath'));
    const params = {
      Bucket: String(config.get('aws.bucket')),
      Key: `${imageFolderPath}/${filename}`,
    };
    await this.client.send(new DeleteObjectCommand(params));
  }
  getObjectUri(filename: string): string {
    const bucket = String(config.get('aws.bucket'));
    const region = String(config.get('aws.region'));
    const imageFolderPath = String(config.get('aws.imagePath'));

    return `https://${bucket}.s3.${region}.amazonaws.com/${imageFolderPath}/${filename}`;
  }
}
