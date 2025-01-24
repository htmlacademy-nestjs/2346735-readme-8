import { DynamicModule, Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({})
export class PrismaModule {
  static forRoot(configPath: string): DynamicModule {
    return {
      module: PrismaModule,
      providers: [
        {
          provide: 'PRISMA_CONFIG_PATH',
          useValue: configPath,
        },
        PrismaService,
      ],
      exports: [PrismaService],
    };
  }
}
