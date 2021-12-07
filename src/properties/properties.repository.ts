import { ConflictException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { FilesService } from "src/common/files.service";
import { Files } from "src/identities/files.entity";
import { IProperties } from "./interfaces/properties.interface";
import { Properties } from "./properties.entity";
import { PropertyImages } from "./property-images.entity";

@Injectable()
export class PropertiesRepository {

    constructor(
        @Inject('PROPERTIES_REPOSITORY')
        private propertiesDBRepository: typeof Properties,
        @Inject('PROPERTY_IMAGES_REPOSITORY')
        private propertyImagesDBRepository: typeof PropertyImages,
        @Inject('UPLOAD_FILES_REPOSITORY')
        private uploadFilesProviders: FilesService,
    ) { }

    async createProperty(property: IProperties, files: Array<Express.Multer.File>): Promise<IProperties> {
        try {
            const nProperty = await this.propertiesDBRepository.create({
                name: property.name,
                description: property.description,
                address: property.address,
                coordinates: property.coordinates,
                totalTokens: property.totalTokens,
                tokenPrice: property.tokenPrice,
                startDate: property.startDate,
                endDate: property.endDate,
                type: property.type,
                constructionYear: property.constructionYear,
                neighborhood: property.neighborhood,
                squareFeet: property.squareFeet,
                lotSize: property.lotSize,
                totalUnits: property.totalUnits,
                bedroom: property.bedroom,
                bath: property.bath,
                rented: property.rented,
                section8: property.section8,
                contractId: property.contractId,
            });

            let isMain = true;
            let imgCount = 0;

            const gFiles = await this.uploadFilesProviders.uploadBulk(files);

            const getFiles = await Promise.allSettled(gFiles);
            getFiles.map((res) => {
                if (res.status === "fulfilled") {
                    if (res.value.status === "uploaded") {
                        if (imgCount > 0) isMain = false;
                        imgCount++;
                        this.setFiles(nProperty, res.value.name, isMain);
                        return res.value;
                    } else {
                        return res.value.reason;
                    }
                }
            });

            return nProperty;

        } catch (error) {
            throw new ConflictException(error.message);
        }
    }

    async setFiles(property: IProperties, file: string, isMain: boolean): Promise<any> {

        try {
            const fProperty = await this.getPropertyById(property);
            await this.propertyImagesDBRepository.create({ propertyId: fProperty.id, fileId: file, isMain: isMain });
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async getPropertyById(property: IProperties): Promise<IProperties> {
        return await this.propertiesDBRepository.findOne({ where: { id: property.id } });
    }

    async getAllProperties(): Promise<IProperties[]> {
        return await this.propertiesDBRepository.findAll({ include: { model: Files, through: { attributes: ['isMain'] } } });
    }

    async deleteProperty(property: IProperties): Promise<void> {
        await this.uploadFilesProviders.delPropertyFilesDB(property);
        await this.propertiesDBRepository.destroy({ where: { id: property.id } });
    }

    async editProperty(id: IProperties, property: IProperties): Promise<IProperties> {
        try {
            await this.propertiesDBRepository.update({
                name: property.name,
                description: property.description,
                address: property.address,
                coordinates: property.coordinates,
                totalTokens: property.totalTokens,
                tokenPrice: property.tokenPrice,
                startDate: property.startDate,
                endDate: property.endDate,
                type: property.type,
                constructionYear: property.constructionYear,
                neighborhood: property.neighborhood,
                squareFeet: property.squareFeet,
                lotSize: property.lotSize,
                totalUnits: property.totalUnits,
                bedroom: property.bedroom,
                bath: property.bath,
                rented: property.rented,
                section8: property.section8,
                contractId: property.contractId,
            }, { where: { id: id.id } });

            const gProperty = await this.getPropertyById(id);
            return gProperty;

        } catch (error) {
            throw new ConflictException(error.message);
        }
    }

}