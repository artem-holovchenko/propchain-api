import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "../../auth/role.enum";

export class UpdateRoleDto {
    @ApiProperty({ required: true, format: 'string' })
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
}