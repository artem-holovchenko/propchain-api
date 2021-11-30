import { FilesService } from "src/common/files.service";

export const propertyFilesProviders = [
    {
        provide: 'PROPERTY_FILES_REPOSITORY',
        useClass: FilesService,
    },
];