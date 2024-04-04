import { ArgumentMetadata, BadRequestException, ValidationPipe } from "@nestjs/common";

export async function validation(Dto, dto) {
  const validatonPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: Dto,
    data: '',
  };
  await validatonPipe.transform(dto, metadata).catch((err) => {
    throw new BadRequestException('잘못된 요청입니다!')
  });
}