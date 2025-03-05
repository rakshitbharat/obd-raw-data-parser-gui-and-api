import { NextResponse } from 'next/server';
import { parseOBDResponse, getPIDInfo, VinDecoder } from 'obd-raw-data-parser';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: Request) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400'
        },
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, data } = body;

        // Create response object to add CORS headers
        const response = (() => {
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
                    
                    if (typeof data === 'string') {
                        if (data.includes('\r')) {
                            vinResult = VinDecoder.processVINResponse(data);
                        } else {
                            vinResult = VinDecoder.processVINSegments(data);
                        }
                    } else if (Array.isArray(data)) {
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
        })();

        // Add CORS headers to the response
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        return response;

    } catch (error) {
        const errorResponse = NextResponse.json(
            { error: 'Internal server error' }, 
            { status: 500 }
        );
        
        // Add CORS headers even to error responses
        errorResponse.headers.set('Access-Control-Allow-Origin', '*');
        errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        return errorResponse;
    }
}