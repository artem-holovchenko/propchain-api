import { IsEmail, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthSignupDto {

    id: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    first_name: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    last_name: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsPhoneNumber()
    phone: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password is too weak'
    })
    password: string;

    salt: string;
}