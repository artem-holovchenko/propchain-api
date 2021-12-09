import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PropertiesDto {

    id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'string' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'string' })
    description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'string' })
    address: string;

    @ApiProperty()
    coordinates: string;

    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'number' })
    totalTokens: number;

    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'number' })
    tokenPrice: number;

    @IsNotEmpty()
    @ApiProperty()
    startDate: Date;

    @IsNotEmpty()
    @ApiProperty()
    endDate: Date;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'string' })
    type: string;

    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'number' })
    constructionYear: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'string' })
    neighborhood: string;

    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'number' })
    squareFeet: number;

    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'number' })
    lotSize: number;

    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'number' })
    totalUnits: number;

    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'number' })
    bedroom: number;

    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'number' })
    bath: number;

    @IsString()
    @ApiProperty({ required: true, format: 'string' })
    rented: string;

    @IsString()
    @ApiProperty({ required: true, format: 'string' })
    contractId: string;
}