import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { propertiesProviders } from './properties.providers';
import { propertyImagesProviders } from './property-images.providers';
import { PropertiesRepository } from './properties.repository';
import { UsersModule } from 'src/users/users.module';
import { propertyFilesProviders } from './property-files.providers';
import { filesProviders } from 'src/common/files.providers';

@Module({
  imports: [UsersModule],
  providers: [PropertiesService, PropertiesRepository, ...propertiesProviders, ...propertyImagesProviders, ...propertyFilesProviders, ...filesProviders],
  controllers: [PropertiesController],
  exports: [PropertiesRepository]
})
export class PropertiesModule { }
