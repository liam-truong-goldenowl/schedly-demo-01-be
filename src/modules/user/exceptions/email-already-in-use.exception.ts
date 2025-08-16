import { UnprocessableEntityException } from '@nestjs/common';

export class EmailAlreadyInUseException extends UnprocessableEntityException {
  constructor() {
    super('Email is already in use');
  }
}
