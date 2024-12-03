import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsModule } from './films/films.module';
import { ExternalApiModule } from './external-api/external-api.module';

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
    FilmsModule,
  ],
})
export class AppModule {}
