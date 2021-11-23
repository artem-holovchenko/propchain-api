import { ApiProperty } from "@nestjs/swagger";

export class UserEmailToken {
    @ApiProperty()
    token: string;
}