import { Get, Controller } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@Controller('/')
export class AppController {
  @Get('/health')
  @ApiOkResponse({
    description: 'Health check endpoint',
    content: { 'text/plain': { schema: { type: 'string', example: 'Ok!' } } },
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  getHealth(): string {
    return 'Ok!';
  }
}
