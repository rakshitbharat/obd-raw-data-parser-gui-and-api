import { parseOBDResponse, getPIDInfo, VinDecoder } from 'obd-raw-data-parser';

export const testParser = {
    parseOBD: parseOBDResponse,
    getPIDInfo,
    VinDecoder
};