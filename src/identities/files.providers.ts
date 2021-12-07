import { Files } from "./files.entity";

export const filesProviders = [
    {
        provide: 'FILES_REPOSITORY',
        useValue: Files,
    },
];