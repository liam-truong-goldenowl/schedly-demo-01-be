import { initApplication } from './app';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await initApplication();

  const configService = app.get(ConfigService);

  const { port } = configService.getOrThrow('app');

  await app.listen(port, () => {
    console.log(`Application is running on port: ${port}`);
  });
}

void bootstrap();
