import { NextResponse } from "next/server";
import {
  parseOBDResponse,
  getPIDInfo,
  VinDecoder,
  DTCBaseDecoder,
} from "obd-raw-data-parser";

// Create DTC decoders for different modes with isCan: true
const mode03Decoder = new DTCBaseDecoder({
  isCan: true,
  serviceMode: "03",
  troubleCodeType: "CURRENT",
});

const mode07Decoder = new DTCBaseDecoder({
  isCan: true,
  serviceMode: "07",
  troubleCodeType: "PENDING",
});

const mode0ADecoder = new DTCBaseDecoder({
  isCan: true,
  serviceMode: "0A",
  troubleCodeType: "PERMANENT",
});

// Create DTC decoders for different modes with isCan: false
const mode03DecoderNonCan = new DTCBaseDecoder({
  isCan: false,
  serviceMode: "03",
  troubleCodeType: "CURRENT",
});

const mode07DecoderNonCan = new DTCBaseDecoder({
  isCan: false,
  serviceMode: "07",
  troubleCodeType: "PENDING",
});

const mode0ADecoderNonCan = new DTCBaseDecoder({
  isCan: false,
  serviceMode: "0A",
  troubleCodeType: "PERMANENT",
});

// Handle GET requests
export async function GET() {
  return NextResponse.json(
    {
      status: "success",
      data: {
        apiVersion: "1.0",
        description: "OBD-II Data Parser API",
        endpoints: {
          "POST /api/obd": {
            description: "Parse OBD-II data or get PID information",
            body: {
              action: {
                type: "string",
                enum: [
                  "parseOBD",
                  "getPIDInfo",
                  "processVIN",
                  "validateVIN",
                  "isVinData",
                  "decodeDTC",
                ],
                required: true,
              },
              data: {
                type: "string",
                description: "The data to process",
                required: true,
              },
              mode: {
                type: "string",
                enum: ["03", "07", "0A"],
                description: "DTC mode (required for decodeDTC action)",
                required: false,
              },
              isCan: {
                type: "boolean",
                description:
                  "Whether to use CAN or non-CAN decoder (required for decodeDTC action)",
                required: false,
              },
            },
            examples: [
              {
                description: "Parse vehicle speed (50 km/h)",
                request: {
                  action: "parseOBD",
                  data: "41 0D 32",
                },
                response: {
                  status: "success",
                  data: {
                    mode: "41",
                    pid: "0D",
                    name: "vss",
                    unit: "km/h",
                    value: 50,
                  },
                },
              },
              {
                description: "Get PID information for RPM",
                request: {
                  action: "getPIDInfo",
                  data: "0C",
                },
                response: {
                  status: "success",
                  data: {
                    mode: "01",
                    pid: "0C",
                    name: "rpm",
                    description: "Engine RPM",
                    min: 0,
                    max: 16383.75,
                    unit: "rev/min",
                    bytes: 2,
                  },
                },
              },
              {
                description: "Process VIN data",
                request: {
                  action: "processVIN",
                  data: "014\r0:49020157304C\r1:4A443745433247\r2:42353839323737",
                },
                response: {
                  status: "success",
                  data: {
                    vin: "W0LJD7EC2GB589277",
                  },
                },
              },
            ],
          },
        },
      },
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(request: Request) {
  try {
    if (!request.body) {
      return NextResponse.json(
        {
          status: "error",
          error: "Request body is required",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, data, mode, isCan = true } = body;

    if (!action) {
      return NextResponse.json(
        {
          status: "error",
          error: "Action is required",
        },
        { status: 400 }
      );
    }

    // Create response object to add CORS headers
    const response = (() => {
      switch (action) {
        case "decodeDTC":
          if (!mode) {
            return NextResponse.json(
              {
                status: "error",
                error: "Mode is required for DTC decoding",
              },
              { status: 400 }
            );
          }
          let decoder;
          if (isCan) {
            switch (mode) {
              case "03":
                decoder = mode03Decoder;
                break;
              case "07":
                decoder = mode07Decoder;
                break;
              case "0A":
                decoder = mode0ADecoder;
                break;
              default:
                return NextResponse.json(
                  {
                    status: "error",
                    error: "Invalid DTC mode",
                  },
                  { status: 400 }
                );
            }
          } else {
            switch (mode) {
              case "03":
                decoder = mode03DecoderNonCan;
                break;
              case "07":
                decoder = mode07DecoderNonCan;
                break;
              case "0A":
                decoder = mode0ADecoderNonCan;
                break;
              default:
                return NextResponse.json(
                  {
                    status: "error",
                    error: "Invalid DTC mode",
                  },
                  { status: 400 }
                );
            }
          }
          // Parse the input data as array of arrays of numbers
          let dtcData;
          try {
            dtcData = JSON.parse(data);
          } catch (e) {
            return NextResponse.json(
              {
                status: "error",
                error:
                  "Invalid DTC data format. Expected JSON array of arrays of numbers.",
              },
              { status: 400 }
            );
          }
          return NextResponse.json({
            status: "success",
            data: decoder.decodeDTCs(dtcData),
          });

        case "parseOBD":
          return NextResponse.json({
            status: "success",
            data: parseOBDResponse(data),
          });

        case "getPIDInfo":
          return NextResponse.json({
            status: "success",
            data: getPIDInfo(data),
          });

        case "processVIN":
          return NextResponse.json({
            status: "success",
            data: { vin: VinDecoder.processVINResponse(data) },
          });

        case "validateVIN":
          return NextResponse.json({
            status: "success",
            data: VinDecoder.validateVIN(data),
          });

        case "isVinData":
          return NextResponse.json({
            status: "success",
            data: VinDecoder.isVinData(data),
          });

        default:
          return NextResponse.json(
            {
              status: "error",
              error: "Invalid action",
            },
            { status: 400 }
          );
      }
    })();

    // Add CORS headers to the response
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Content-Type", "application/json");

    return response;
  } catch (err) {
    console.error("Error:", err);
    const errorResponse = NextResponse.json(
      {
        status: "error",
        error: "Internal server error",
        message: err instanceof Error ? err.message : "Unknown error occurred",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Content-Type": "application/json",
        },
      }
    );

    return errorResponse;
  }
}
