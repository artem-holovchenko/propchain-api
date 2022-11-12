import { ApiProperty } from "@nestjs/swagger";

export class EmailTokenDto {
    @ApiProperty()
    emailToken: string;
}