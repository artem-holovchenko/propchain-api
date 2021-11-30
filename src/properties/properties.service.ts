import { Injectable } from '@nestjs/common';
import { IProperties } from './interfaces/properties.interface';
import { PropertiesRepository } from './properties.repository';

@Injectable()
export class PropertiesService {
    constructor(
        private propertiesRepository: PropertiesRepository,
    ) { }

    async createProperty(property: IProperties, files: Array<Express.Multer.File>): Promise<IProperties> {
        return await this.propertiesRepository.createProperty(property, files);
    }
}