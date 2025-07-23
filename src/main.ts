import { ConfigService } from '@nestjs/config';

import { initApplication } from './app';

async function bootstrap() {
  const app = await initApplication();
  const configService = app.get(ConfigService);

  const port = configService.get<number>('app.port', 3000);
  await app.listen(port, () => {
    console.log(`Application is running on port: ${port}`);
  });
}

void bootstrap();
