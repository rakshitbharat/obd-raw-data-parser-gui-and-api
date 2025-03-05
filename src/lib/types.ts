export interface ApiResponse {
    status?: string;
    data?: any;
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

export type DTCMode = '03' | '07' | '0A';

export interface DTCDecoderParams {
    logPrefix: string;
    isCan: boolean;
    serviceMode: DTCMode;
    troubleCodeType: 'CURRENT' | 'PENDING' | 'PERMANENT';
}

export interface DTCResponse {
    status: 'success' | 'error';
    data?: string[];  // Array of DTC codes like ['P0101', 'P0113']
    error?: string;
}