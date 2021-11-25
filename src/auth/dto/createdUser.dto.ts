import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../role.enum";

export class CreatedUserDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    emailIsVerified: boolean;

    @ApiProperty()
    role: Role;

    @ApiProperty()
    token: string;
}