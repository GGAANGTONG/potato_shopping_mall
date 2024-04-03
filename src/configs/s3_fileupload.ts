import S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';

export class S3FileService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const s3 = new S3({
      accessKeyId: process.env.S3_ACCESSKEY,
      secretAccessKey: process.env.S3_SECRETKEY,
    });
    try {
      const extension = file.originalname.substring(
        file.originalname.lastIndexOf('.'),
      );
      const uniqueKey = uuidv4(); // 고유 식별자 생성
      const key = `${uniqueKey}_potato${extension}`;
      await s3
        .putObject({
          Key: key,
          Body: file.buffer,
          Bucket: process.env.S3_BUCKET,
        })
        .promise();

      return key;
    } catch (error) {
      console.error(error);
      throw new Error('파일 업로드 중 에러 발생');
    }
  }
}
