import S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';

export class S3FileService {
  private s3: S3;
  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.S3_ACCESSKEY,
      secretAccessKey: process.env.S3_SECRETKEY,
    });
  }

  async uploadFile(file: Express.Multer.File, folderPath): Promise<string> {
    try {
      const extension = file.originalname.substring(
        file.originalname.lastIndexOf('.'),
      );
      const uniqueKey = uuidv4(); // 고유 식별자 생성
      const key = `${folderPath}/${uniqueKey}_potato${extension}`;
      await this.s3
        .putObject({
          Key: key,
          Body: file.buffer,
          Bucket: process.env.S3_BUCKET,
          ContentType: file.mimetype,
        })
        .promise();

      return key;
    } catch (error) {
      console.error(error);
      throw new Error('파일 업로드 중 에러 발생');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3
        .deleteObject({
          Key: key,
          Bucket: process.env.S3_BUCKET,
        })
        .promise();
    } catch (error) {
      console.error(error);
      throw new Error('파일 삭제 중 에러 발생');
    }
  }
}
