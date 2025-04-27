import { DTCBaseDecoder } from "obd-raw-data-parser";

// Example 1: Decode Current DTCs (Mode 03)
const mode03Decoder = new DTCBaseDecoder({
  isCan: true,
  serviceMode: "03",
  troubleCodeType: "CURRENT"
});
const currentDTCData = [[0x43, 0x01, 0x33, 0x00, 0x00, 0x00, 0x00]];
const decodedCurrentDTCs = mode03Decoder.decodeDTCs(currentDTCData);
console.log("Current DTCs:", decodedCurrentDTCs);

// Example 2: Decode Pending DTCs (Mode 07)
const mode07Decoder = new DTCBaseDecoder({
  isCan: true,
  serviceMode: "07",
  troubleCodeType: "PENDING"
});
const pendingDTCData = [[0x47, 0x01, 0x33, 0x00, 0x00, 0x00, 0x00]];
const decodedPendingDTCs = mode07Decoder.decodeDTCs(pendingDTCData);
console.log("Pending DTCs:", decodedPendingDTCs);

// Example 3: Decode Permanent DTCs (Mode 0A)
const mode0ADecoder = new DTCBaseDecoder({
  isCan: true,
  serviceMode: "0A",
  troubleCodeType: "PERMANENT"
});
const permanentDTCData = [[0x4A, 0x01, 0x33, 0x00, 0x00, 0x00, 0x00]];
const decodedPermanentDTCs = mode0ADecoder.decodeDTCs(permanentDTCData);
console.log("Permanent DTCs:", decodedPermanentDTCs);
