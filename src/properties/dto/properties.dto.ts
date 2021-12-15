import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PropertiesDto {

    id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'property', required: true, format: 'string' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'description', required: true, format: 'string' })
    description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'address', required: true, format: 'string' })
    address: string;

    @ApiProperty()
    coordinates: string;

    @IsNotEmpty()
    @ApiProperty({ example: 1000, required: true, format: 'number' })
    totalTokens: number;

    @IsNotEmpty()
    @ApiProperty({ example: 51.39, required: true, format: 'number' })
    tokenPrice: number;

    @IsNotEmpty()
    @ApiProperty({ example: '2021-12-15', format: 'date' })
    startDate: Date;

    @IsNotEmpty()
    @ApiProperty({ example: '2021-12-15', type: 'date' })
    endDate: Date;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Single Family', required: true, format: 'string' })
    type: string;

    @IsNotEmpty()
    @ApiProperty({ example: 1952, required: true, format: 'number' })
    constructionYear: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Mount Olivet', required: true, format: 'string' })
    neighborhood: string;

    @IsNotEmpty()
    @ApiProperty({ example: 500, required: true, format: 'number' })
    squareFeet: number;

    @IsNotEmpty()
    @ApiProperty({ example: 4.356, required: true, format: 'number' })
    lotSize: number;

    @IsNotEmpty()
    @ApiProperty({ example: 8, required: true, format: 'number' })
    totalUnits: number;

    @IsNotEmpty()
    @ApiProperty({ example: 1, required: true, format: 'number' })
    bedroom: number;

    @IsNotEmpty()
    @ApiProperty({ example: 1, required: true, format: 'number' })
    bath: number;

    @IsString()
    @ApiProperty({ example: 54.27, required: true, format: 'string' })
    rented: string;

    @IsString()
    @ApiProperty({ required: true, format: 'string' })
    contractId: string;
}