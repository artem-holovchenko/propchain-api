import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PropertyFilterDto {

    @IsNotEmpty()
    @ApiProperty({ required: true, format: 'number' })
    page: number;

    @ApiProperty({ format: 'number' })
    minPrice: number;

    @ApiProperty({ format: 'number' })
    maxPrice: number;

    @ApiProperty({ format: 'number' })
    bedroomsFrom: number;

    @ApiProperty({ format: 'number' })
    bedroomsTo: number;

    @ApiProperty({ format: 'number' })
    bathFrom: number;

    @ApiProperty({ format: 'number' })
    bathTo: number;

    @ApiProperty({ format: 'number' })
    totalUnitsFrom: number;

    @ApiProperty({ format: 'number' })
    totalUnitsTo: number;

    @ApiProperty({ format: 'number' })
    squareFeetFrom: number;

    @ApiProperty({ format: 'number' })
    squareFeetTo: number;  

    @IsString()
    @IsIn([
        '',
        'totalPrice',
        'tokenPrice',
        'startDate',
    ])
    sortBy: string;
}