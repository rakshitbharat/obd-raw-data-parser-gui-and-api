import { NextResponse } from 'next/server';
import { testParser } from '@/lib/obd-parser';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, data } = body;

        switch (action) {
            case 'parseOBD':
                if (!data) {
                    return NextResponse.json({ error: 'Data is required' }, { status: 400 });
                }
                const parsedData = testParser.parseOBD(data);
                return NextResponse.json(parsedData);

            case 'getPIDInfo':
                if (!data) {
                    return NextResponse.json({ error: 'PID is required' }, { status: 400 });
                }
                const pidInfo = testParser.getPIDInfo(data);
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
                        vinResult = testParser.VinDecoder.processVINResponse(data);
                    } else {
                        // Hex format
                        vinResult = testParser.VinDecoder.processVINSegments(data);
                    }
                } else if (Array.isArray(data)) {
                    // Byte array format
                    vinResult = testParser.VinDecoder.processVINByteArray(data);
                }
                
                return NextResponse.json({ vin: vinResult });

            case 'validateVIN':
                if (!data) {
                    return NextResponse.json({ error: 'VIN is required' }, { status: 400 });
                }
                const isValid = testParser.VinDecoder.validateVIN(data);
                return NextResponse.json({ isValid });

            case 'isVinData':
                if (!data) {
                    return NextResponse.json({ error: 'Data is required' }, { status: 400 });
                }
                const isVinData = testParser.VinDecoder.isVinData(data);
                return NextResponse.json({ isVinData });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}