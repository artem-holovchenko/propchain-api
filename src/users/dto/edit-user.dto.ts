import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength, IsEmail } from "class-validator";

export class EditUserDto {
    @ApiProperty({ required: true, format: 'string' })
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    firstName: string;

    @ApiProperty({ required: true, format: 'string' })
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    lastName: string;

    @ApiProperty({ required: true, format: 'string' })
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @ApiProperty({ required: true, format: 'string' })
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;
}