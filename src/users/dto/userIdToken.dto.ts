import { ApiProperty } from "@nestjs/swagger";

export class UserIdToken {
    @ApiProperty()
    token: string;
}