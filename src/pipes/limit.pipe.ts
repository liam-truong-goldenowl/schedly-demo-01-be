import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class LimitPipe implements PipeTransform {
  constructor(private defaultValue: number) {}

  transform(value: any): number {
    const limit = value !== undefined ? parseInt(value, 10) : this.defaultValue;

    if (isNaN(limit) || limit <= 0) {
      throw new BadRequestException('Limit must be a positive integer');
    }

    return limit;
  }
}
