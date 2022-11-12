import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthSignupDto {

    id: string;

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

    @ApiProperty({ required: true, format: 'string' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ required: true, format: 'string' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password is too weak'
    })
    password: string;
}