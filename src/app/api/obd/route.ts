import { NextResponse } from 'next/server';
import { testParser } from '@/lib/obd-parser';

// Handle GET requests
export async function GET() {
    return NextResponse.json({
        status: 'success',
        message: 'OBD-II Parser API',
        endpoints: {
            'POST /api/obd': {
                description: 'Parse OBD-II data or get PID information',
                body: {
                    action: {
                        type: 'string',
                        enum: ['parseOBD', 'getPIDInfo', 'processVIN', 'validateVIN', 'isVinData']
                    },
                    data: {
                        type: 'string',
                        description: 'The data to process'
                    }
                },
                examples: [
                    {
                        action: 'parseOBD',
                        data: '41 0D 32'
                    },
                    {
                        action: 'getPIDInfo',
                        data: '0C'
                    }
                ]
            }
        }
    }, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
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
        if (!request.body) {
            return NextResponse.json({ 
                status: 'error',
                error: 'Request body is required' 
            }, { status: 400 });
        }

        const body = await request.json();
        const { action, data } = body;

        if (!action) {
            return NextResponse.json({ 
                status: 'error',
                error: 'Action is required' 
            }, { status: 400 });
        }

        // Create response object to add CORS headers
        const response = (() => {
            switch (action) {
                case 'parseOBD':
                    if (!data) {
                        return NextResponse.json({ 
                            status: 'error',
                            error: 'Data is required' 
                        }, { status: 400 });
                    }
                    const parsedData = testParser.parseOBD(data);
                    return NextResponse.json({
                        status: 'success',
                        data: parsedData
                    });

                case 'getPIDInfo':
                    if (!data) {
                        return NextResponse.json({ 
                            status: 'error',
                            error: 'PID is required' 
                        }, { status: 400 });
                    }
                    const pidInfo = testParser.getPIDInfo(data);
                    return NextResponse.json({
                        status: 'success',
                        data: pidInfo
                    });

                case 'processVIN':
                    if (!data) {
                        return NextResponse.json({ 
                            status: 'error',
                            error: 'VIN data is required' 
                        }, { status: 400 });
                    }
                    let vinResult;
                    
                    if (typeof data === 'string') {
                        if (data.includes('\r')) {
                            vinResult = testParser.VinDecoder.processVINResponse(data);
                        } else {
                            vinResult = testParser.VinDecoder.processVINSegments(data);
                        }
                    } else if (Array.isArray(data)) {
                        vinResult = testParser.VinDecoder.processVINByteArray(data);
                    }
                    
                    return NextResponse.json({
                        status: 'success',
                        data: { vin: vinResult }
                    });

                case 'validateVIN':
                    if (!data) {
                        return NextResponse.json({ 
                            status: 'error',
                            error: 'VIN is required' 
                        }, { status: 400 });
                    }
                    const isValid = testParser.VinDecoder.validateVIN(data);
                    return NextResponse.json({
                        status: 'success',
                        data: { isValid }
                    });

                case 'isVinData':
                    if (!data) {
                        return NextResponse.json({ 
                            status: 'error',
                            error: 'Data is required' 
                        }, { status: 400 });
                    }
                    const isVinData = testParser.VinDecoder.isVinData(data);
                    return NextResponse.json({
                        status: 'success',
                        data: { isVinData }
                    });

                default:
                    return NextResponse.json({ 
                        status: 'error',
                        error: 'Invalid action' 
                    }, { status: 400 });
            }
        })();

        // Add CORS headers to the response
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Content-Type', 'application/json');
        
        return response;

    } catch (err) {
        console.error('Error:', err);
        const errorResponse = NextResponse.json({ 
            status: 'error',
            error: 'Internal server error',
            message: err instanceof Error ? err.message : 'Unknown error occurred'
        }, { 
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Content-Type': 'application/json'
            }
        });
        
        return errorResponse;
    }
}