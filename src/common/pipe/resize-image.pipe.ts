import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ResizeImagePipe implements PipeTransform {
  constructor(
    private readonly width: number,
    private readonly height: number,
  ) {}

  async transform(value: Express.Multer.File): Promise<Express.Multer.File> {
    try {
      if (!value || !value.buffer) {
        throw new BadRequestException('파일이 제공되지 않았습니다.');
      }

      // 이미지 리사이징
      const resizedBuffer = await sharp(value.buffer)
        .resize({ width: this.width, height: this.height, fit: 'inside' })
        .toBuffer();

      // 리사이징된 이미지의 버퍼를 새 파일 데이터에 할당
      const transformedFile = {
        ...value,
        buffer: resizedBuffer,
      };

      return transformedFile;
    } catch (error) {
      throw new BadRequestException('이미지 리사이징 중 에러 발생');
    }
  }
}
