import { ConfigService } from '@nestjs/config';

export const rabbitMQConfig = async (config: ConfigService) => ({
  exchanges: [
    {
      name: config.get<string>('RABBIT_EXCHANGE'),
      type: 'direct',
    },
  ],
  uri: `amqp://${config.get<string>('RABBIT_USER')}:${config.get<string>(
    'RABBIT_PASSWORD'
  )}@${config.get<string>('RABBIT_HOST')}:${config.get<string>('RABBIT_PORT')}`,
  connectionInitOptions: { wait: false },
  enableControllerDiscovery: true,
});
