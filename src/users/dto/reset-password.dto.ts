import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({ required: true, format: 'string' })
    @IsNotEmpty()
    @IsString()
    password: string;
    
    @ApiProperty({ required: true, format: 'string' })
    @IsNotEmpty()
    @IsString()
    token: string;
}