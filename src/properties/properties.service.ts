import { Injectable } from '@nestjs/common';
import { PropertyPageDto } from './dto/property-page.dto';
import { IProperties } from './interfaces/properties.interface';
import { PropertiesRepository } from './properties.repository';

@Injectable()
export class PropertiesService {
    constructor(
        private propertiesRepository: PropertiesRepository,
    ) { }

    async createProperty(property: IProperties, files: Array<Express.Multer.File>): Promise<IProperties> {
        return this.propertiesRepository.createProperty(property, files);
    }

    async editProperty(id: IProperties, property: IProperties): Promise<IProperties> {
        return this.propertiesRepository.editProperty(id, property);
    }

    async deleteProperty(id: IProperties): Promise<void> {
        return this.propertiesRepository.deleteProperty(id);
    }

    async getAllProperties(propPage: PropertyPageDto): Promise<IProperties[]> {
        return this.propertiesRepository.getAllProperties(propPage);
    }
}
