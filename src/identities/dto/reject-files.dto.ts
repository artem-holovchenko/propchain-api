import { ApiProperty } from "@nestjs/swagger";

export class RejectFilesDto {

    @ApiProperty()
    userId: string;

    @ApiProperty()
    description: string;
}