import { ApiProperty } from "@nestjs/swagger";

export class CreatedUserDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;
}