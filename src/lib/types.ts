export interface ApiResponse {
    error?: string;
    mode?: string;
    pid?: string;
    name?: string;
    unit?: string;
    value?: number;
    description?: string;
    min?: number;
    max?: number;
    bytes?: number;
    vin?: string;
    isValid?: boolean;
    isVinData?: boolean;
}