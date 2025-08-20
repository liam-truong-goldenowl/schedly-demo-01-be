import {
  IsEnum,
  IsString,
  IsOptional,
  ValidateIf,
  IsDateString,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

import { Period } from '../../enums/period.enum';

export class ListMeetingsQueryDto {
  @IsOptional()
  @IsEnum(Period)
  @DatesRequiredWhenFixed()
  period: Period = Period.UPCOMING;

  @IsDateString()
  @ValidateIf((o) => o.period === Period.FIXED)
  startDate?: string;

  @IsDateString()
  @ValidateIf((o) => o.period === Period.FIXED)
  endDate?: string;

  @IsOptional()
  @IsString()
  eventSlug?: string;

  @IsOptional()
  @IsString()
  cursor?: string;
}

function DatesRequiredWhenFixed(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'datesRequiredWhenFixed',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const PASS_VALIDATION = true;
          const obj = args.object as ListMeetingsQueryDto;
          const hasStartDate = !!obj.startDate;
          const hasEndDate = !!obj.endDate;
          return obj.period === Period.FIXED
            ? hasStartDate && hasEndDate
            : PASS_VALIDATION;
        },
        defaultMessage() {
          return `startDate and endDate are required when period is "fixed"`;
        },
      },
    });
  };
}
