import { FilesService } from "src/common/files.service";

export const uploadFilesProviders = [
    {
        provide: 'UPLOAD_FILES_REPOSITORY',
        useClass: FilesService,
    },
];