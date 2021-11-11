import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/auth/role.enum";

export class GetUserDto {

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

}