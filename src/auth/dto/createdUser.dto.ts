import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../role.enum";

export class CreatedUserDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    role: Role;
}