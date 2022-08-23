import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('typeorm.host'),
      port: this.config.get<number>('typeorm.port'),
      database: this.config.get<string>('typeorm.database'),
      username: this.config.get<string>('typeorm.username'),
      password: this.config.get<string>('typeorm.password'),
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      logger: 'file',
      synchronize: this.config.get<boolean>('synchronize'),
    };
  }
}
