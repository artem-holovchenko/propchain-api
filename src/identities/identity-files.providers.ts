import { IdentityFiles } from "./identity-files.entity";

export const identityFilesProviders = [
    {
        provide: 'IDENTITY_FILES_REPOSITORY',
        useValue: IdentityFiles,
    },
];