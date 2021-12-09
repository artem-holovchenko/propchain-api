export interface IPropertyFilters {
    page: number;
    minPrice?: number;
    maxPrice?: number;
    bedroomsFrom?: number;
    bedroomsTo?: number;
    bathFrom?: number;
    bathTo?: number;
    totalUnitsFrom?: number;
    totalUnitsTo?: number;
    squareFeetFrom?: number;
    squareFeetTo?: number;  
    sortBy?: string;
}