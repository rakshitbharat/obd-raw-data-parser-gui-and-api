import { NextResponse } from 'next/server';
import { parseOBDResponse, getPIDInfo, VinDecoder } from 'obd-raw-data-parser';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, data } = body;

        switch (action) {
            case 'parseOBD':
                if (!data) {
                    return NextResponse.json({ error: 'Data is required' }, { status: 400 });
                }
                const parsedData = parseOBDResponse(data);
                return NextResponse.json(parsedData);

            case 'getPIDInfo':
                if (!data) {
                    return NextResponse.json({ error: 'PID is required' }, { status: 400 });
                }
                const pidInfo = getPIDInfo(data);
                return NextResponse.json(pidInfo);

            case 'processVIN':
                if (!data) {
                    return NextResponse.json({ error: 'VIN data is required' }, { status: 400 });
                }
                let vinResult;
                
                // Detect the format and process accordingly
                if (typeof data === 'string') {
                    if (data.includes('\r')) {
                        // Segmented response format
                        vinResult = VinDecoder.processVINResponse(data);
                    } else {
                        // Hex format
                        vinResult = VinDecoder.processVINSegments(data);
                    }
                } else if (Array.isArray(data)) {
                    // Byte array format
                    vinResult = VinDecoder.processVINByteArray(data);
                }
                
                return NextResponse.json({ vin: vinResult });

            case 'validateVIN':
                if (!data) {
                    return NextResponse.json({ error: 'VIN is required' }, { status: 400 });
                }
                const isValid = VinDecoder.validateVIN(data);
                return NextResponse.json({ isValid });

            case 'isVinData':
                if (!data) {
                    return NextResponse.json({ error: 'Data is required' }, { status: 400 });
                }
                const isVinData = VinDecoder.isVinData(data);
                return NextResponse.json({ isVinData });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}