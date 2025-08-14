import {
  IsEnum,
  IsOptional,
  IsDateString,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export enum Period {
  PAST = 'past',
  UPCOMING = 'upcoming',
  FIXED = 'fixed',
}

export class ListMeetingsQueryDto {
  @IsOptional()
  @IsEnum(Period)
  @DatesRequiredWhenFixed()
  period: Period = Period.UPCOMING;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
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
