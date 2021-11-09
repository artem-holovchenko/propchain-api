import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "../role.enum";

export class UpdateRoleDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
}