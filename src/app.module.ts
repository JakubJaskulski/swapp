import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelloWorldModule } from './hello-world/hello-world.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'test_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    HelloWorldModule,
  ],
})
export class AppModule {}
