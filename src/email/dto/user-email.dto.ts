import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class UserEmailDto {
    @ApiProperty({ required: true, format: 'string' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}