import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../role.enum";

export class CreatedUserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    role: Role;

    @ApiProperty()
    token: string;
}