import { PartialType } from '@nestjs/swagger';
import { CreateTossDto } from './create-toss.dto';

export class UpdateTossDto extends PartialType(CreateTossDto) {}
