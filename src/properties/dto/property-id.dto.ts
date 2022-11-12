import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PropertyIdDto {
    @ApiProperty({ required: true, format: 'string' })
    @IsString()
    @IsNotEmpty()
    id: string;
}