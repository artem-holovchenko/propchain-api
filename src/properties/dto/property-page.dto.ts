import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PropertyPageDto {
    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'number' })
    page: number;
}