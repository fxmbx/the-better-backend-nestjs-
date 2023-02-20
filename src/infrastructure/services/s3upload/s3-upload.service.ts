import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { IFileUploadInterface } from 'src/domain/adapter/file-upload.interface';

@Injectable()
export class S3UploadService implements IFileUploadInterface {
  async uploadFile(filename: string, fileobject: Buffer): Promise<string> {
    try {
      const s3 = this.getS3();
      const s3Response = await s3
        .upload({
          Bucket: process.env.BUCKET_NAME,
          Body: fileobject,
          Key: filename,
          ContentDisposition: 'inline',
          ACL: 'public-read',
        })
        .promise();
      return s3Response.Location;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteFile(key: string) {
    const s3 = this.getS3();
    return await s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
      })
      .promise();
  }
  private getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
