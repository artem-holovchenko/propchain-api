import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class PropertyFilterDto {

    @IsNotEmpty()
    @ApiProperty({ example: 1, required: true, format: 'number' })
    page: number;

    @IsNotEmpty()
    @IsString()
    @IsIn([
        '',
        'totalPrice',
        'tokenPrice',
        'startDate',
    ])
    @ApiProperty({ example: 'totalPrice', format: 'string' })
    sortBy: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'descending', format: 'string' })
    @IsIn(['ascending', 'descending'])
    sortOrder: string;

    @ApiPropertyOptional({ example: 100000, format: 'number' })
    minPrice: number;

    @ApiPropertyOptional({ example: 200000, format: 'number' })
    maxPrice: number;

    @ApiPropertyOptional({ example: 1, format: 'number' })
    bedroomsFrom: number;

    @ApiPropertyOptional({ example: 3, format: 'number' })
    bedroomsTo: number;

    @ApiPropertyOptional({ example: 1, format: 'number' })
    bathFrom: number;

    @ApiPropertyOptional({ example: 3, format: 'number' })
    bathTo: number;

    @ApiPropertyOptional({ example: 5, format: 'number' })
    totalUnitsFrom: number;

    @ApiPropertyOptional({ example: 8, format: 'number' })
    totalUnitsTo: number;

    @ApiPropertyOptional({ example: 400, format: 'number' })
    squareFeetFrom: number;

    @ApiPropertyOptional({ example: 900, format: 'number' })
    squareFeetTo: number;
}