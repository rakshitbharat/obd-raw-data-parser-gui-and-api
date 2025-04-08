'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { ApiResponse } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Home() {
  const [obdResults, setObdResults] = useState<ApiResponse | null>(null);
  const [pidResults, setPidResults] = useState<ApiResponse | null>(null);
  const [vinResults, setVinResults] = useState<ApiResponse | null>(null);
  const [validateVinResults, setValidateVinResults] = useState<ApiResponse | null>(null);
  const [checkVinResults, setCheckVinResults] = useState<ApiResponse | null>(null);
  const [dtcResults, setDtcResults] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubmit = async (action: string, data: string, mode?: string, isCan?: boolean) => {
    try {
      setLoading(action);
      const response = await fetch('/api/obd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, data, mode, isCan }),
      });
      
      const result = await response.json();
      
      switch (action) {
        case 'parseOBD':
          setObdResults(result);
          break;
        case 'getPIDInfo':
          setPidResults(result);
          break;
        case 'processVIN':
          setVinResults(result);
          break;
        case 'validateVIN':
          setValidateVinResults(result);
          break;
        case 'isVinData':
          setCheckVinResults(result);
          break;
        case 'decodeDTC':
          setDtcResults(result);
          break;
      }
    } catch (error) {
      console.error('Error:', error);
      const errorResponse = { error: 'Failed to process request' };
      switch (action) {
        case 'parseOBD':
          setObdResults(errorResponse);
          break;
        case 'getPIDInfo':
          setPidResults(errorResponse);
          break;
        case 'processVIN':
          setVinResults(errorResponse);
          break;
        case 'validateVIN':
          setValidateVinResults(errorResponse);
          break;
        case 'isVinData':
          setCheckVinResults(errorResponse);
          break;
        case 'decodeDTC':
          setDtcResults(errorResponse);
          break;
      }
    } finally {
      setLoading(null);
    }
  };

  const ResultDisplay = ({ results, onClear }: { results: ApiResponse | null, onClear: () => void }) => {
    if (!results) return null;
    return (
      <div className="mt-4 border rounded-lg bg-muted/10">
        <div className="p-3 border-b flex justify-between items-center sticky top-0 bg-background">
          <h4 className="font-medium">Results</h4>
          <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>
        </div>
        <div className="p-3">
          {results.error ? (
            <Alert variant="destructive">
              <AlertDescription>{results.error}</AlertDescription>
            </Alert>
          ) : (
            <div className="relative">
              <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                <pre className="p-4 font-mono text-sm whitespace-pre-wrap bg-muted/50 rounded-md">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background relative isolate">
      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-16">
          <div className="inline-block mb-6 relative">
            <h1 className="text-6xl font-black">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-primary to-purple-600 cursor-default">
                OBD-II Data Parser
              </span>
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A powerful tool for parsing and analyzing OBD-II diagnostic data, VIN processing, and PID information.
          </p>
        </header>

        <main className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="gradient-border card-hover backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-500"></span>
                  Parse OBD Response
                </CardTitle>
                <CardDescription>Enter raw OBD data to parse (e.g., "41 0D 32" for vehicle speed)</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form).get('data') as string;
                  handleSubmit('parseOBD', data);
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="obd-data">OBD Data</Label>
                    <Input id="obd-data" name="data" placeholder="41 0D 32" required className="font-mono" />
                  </div>
                  <Button type="submit" disabled={loading === 'parseOBD'} className="w-full">
                    {loading === 'parseOBD' && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                    Parse Data
                  </Button>
                </form>
                <ResultDisplay results={obdResults} onClear={() => setObdResults(null)} />
              </CardContent>
            </Card>

            <Card className="gradient-border card-hover backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-500"></span>
                  Get PID Information
                </CardTitle>
                <CardDescription>Enter a PID to get its information (e.g., "0C" for RPM)</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form).get('data') as string;
                  handleSubmit('getPIDInfo', data);
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pid">PID</Label>
                    <Input id="pid" name="data" placeholder="0C" required className="font-mono" />
                  </div>
                  <Button type="submit" disabled={loading === 'getPIDInfo'} className="w-full">
                    {loading === 'getPIDInfo' && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                    Get Info
                  </Button>
                </form>
                <ResultDisplay results={pidResults} onClear={() => setPidResults(null)} />
              </CardContent>
            </Card>

            <Card className="gradient-border card-hover backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-500"></span>
                  Process VIN
                </CardTitle>
                <CardDescription>Enter VIN data in any format (segmented, hex, or byte array)</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form).get('data') as string;
                  handleSubmit('processVIN', data);
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vin-data">VIN Data</Label>
                    <Input id="vin-data" name="data" placeholder="014\r0:49020157304C\r1:4A443745433247\r2:42353839323737" required className="font-mono" />
                  </div>
                  <Button type="submit" disabled={loading === 'processVIN'} className="w-full">
                    {loading === 'processVIN' && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                    Process VIN
                  </Button>
                </form>
                <ResultDisplay results={vinResults} onClear={() => setVinResults(null)} />
              </CardContent>
            </Card>

            <Card className="gradient-border card-hover backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-500"></span>
                  Validate VIN
                </CardTitle>
                <CardDescription>Enter a VIN to validate its format</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form).get('data') as string;
                  handleSubmit('validateVIN', data);
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vin">VIN</Label>
                    <Input id="vin" name="data" placeholder="W0LJD7EC2GB589277" required className="font-mono" />
                  </div>
                  <Button type="submit" disabled={loading === 'validateVIN'} className="w-full">
                    {loading === 'validateVIN' && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                    Validate VIN
                  </Button>
                </form>
                <ResultDisplay results={validateVinResults} onClear={() => setValidateVinResults(null)} />
              </CardContent>
            </Card>

            <Card className="gradient-border card-hover backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-500"></span>
                  Check VIN Data
                </CardTitle>
                <CardDescription>Check if the data is VIN-related (e.g., "0902" or "490201")</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form).get('data') as string;
                  handleSubmit('isVinData', data);
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vin-check">Data to Check</Label>
                    <Input id="vin-check" name="data" placeholder="0902" required className="font-mono" />
                  </div>
                  <Button type="submit" disabled={loading === 'isVinData'} className="w-full">
                    {loading === 'isVinData' && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                    Check Data
                  </Button>
                </form>
                <ResultDisplay results={checkVinResults} onClear={() => setCheckVinResults(null)} />
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Card className="gradient-border card-hover backdrop-blur-sm relative z-20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span className="size-3 rounded-full bg-blue-500"></span>
                  Decode Diagnostic Trouble Codes (DTC)
                </CardTitle>
                <CardDescription className="text-lg">
                  Advanced DTC decoder with multiple configuration options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const data = formData.get('data') as string;
                  const mode = formData.get('mode') as string;
                  const isCan = formData.get('isCan') === 'true';
                  
                  try {
                    const jsonData = JSON.parse(data);
                    if (!Array.isArray(jsonData) || !jsonData.every(Array.isArray)) {
                      setDtcResults({
                        status: 'error',
                        error: 'Invalid format. Data must be an array of arrays.'
                      });
                      return;
                    }
                    if (!jsonData.every(arr => arr.every(num => typeof num === 'number'))) {
                      setDtcResults({
                        status: 'error',
                        error: 'Invalid format. All elements must be numbers.'
                      });
                      return;
                    }
                    handleSubmit('decodeDTC', data, mode, isCan);
                  } catch (error) {
                    setDtcResults({
                      status: 'error',
                      error: 'Invalid JSON format. Please check your input.'
                    });
                  }
                }} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dtc-mode" className="text-base">DTC Mode</Label>
                      <select 
                        id="dtc-mode" 
                        name="mode" 
                        className="w-full p-3 border rounded-md bg-background cursor-pointer hover:border-primary/50 transition-colors"
                        required
                      >
                        <option value="03">Mode 03 - Current DTCs</option>
                        <option value="07">Mode 07 - Pending DTCs</option>
                        <option value="0A">Mode 0A - Permanent DTCs</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dtc-protocol" className="text-base">Protocol Type</Label>
                      <select 
                        id="dtc-protocol" 
                        name="isCan" 
                        className="w-full p-3 border rounded-md bg-background cursor-pointer hover:border-primary/50 transition-colors"
                        required
                      >
                        <option value="true">CAN</option>
                        <option value="false">Non-CAN</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dtc-data" className="text-base">
                      DTC Data
                      <span className="text-sm text-muted-foreground ml-2">Format according to selection above</span>
                    </Label>
                    <textarea 
                      id="dtc-data" 
                      name="data" 
                      placeholder='[[52, 51, 48, 49, 48, 49, 48, 49, 49, 51, 13], [13, 62]]'
                      required 
                      className="w-full h-48 p-4 font-mono border rounded-md resize-vertical bg-background hover:border-primary/50 transition-colors"
                      onBlur={(e) => {
                        try {
                          const jsonData = JSON.parse(e.target.value);
                          if (!Array.isArray(jsonData) || !jsonData.every(Array.isArray)) {
                            e.target.setCustomValidity('Data must be an array of arrays');
                          } else if (!jsonData.every(arr => arr.every(num => typeof num === 'number'))) {
                            e.target.setCustomValidity('All elements must be numbers');
                          } else {
                            e.target.setCustomValidity('');
                          }
                        } catch (error) {
                          e.target.setCustomValidity('Invalid JSON format');
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={loading === 'decodeDTC'} 
                      className="min-w-32 relative z-20 hover:translate-y-[-2px] transition-transform"
                    >
                      {loading === 'decodeDTC' && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                      Decode DTCs
                    </Button>
                  </div>
                </form>
                <ResultDisplay results={dtcResults} onClear={() => setDtcResults(null)} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <div className="fixed inset-0 bg-dot-pattern opacity-50 pointer-events-none"></div>
    </div>
  );
}
