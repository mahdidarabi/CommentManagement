import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }

  @IsArray()
  readonly data: T[];
  readonly meta: PageMetaDto;
}
