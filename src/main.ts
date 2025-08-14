import { initApplication } from './app';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await initApplication();

  const configService = app.get(ConfigService);

  const { port } = configService.getOrThrow('app');

  await app.listen(port, () => {
    console.log('\n');
    console.log(`Application is running on: http://localhost:${port}/v1/api`);
    console.log('\n');
  });
}

void bootstrap();
