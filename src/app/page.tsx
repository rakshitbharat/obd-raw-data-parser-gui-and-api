'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (action: string, data: string, mode?: string, isCan?: boolean) => {
    try {
      setLoading(true);
      const response = await fetch('/api/obd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, data, mode, isCan }),
      });
      
      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Error:', error);
      setResults({ error: 'Failed to process request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500">
            OBD-II Data Parser
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A powerful tool for parsing and analyzing OBD-II diagnostic data, VIN processing, and PID information.
          </p>
        </header>

        <main className="max-w-4xl mx-auto space-y-8">
          <Tabs defaultValue="parseOBD" className="w-full">
            <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full mb-8">
              <TabsTrigger value="parseOBD" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Parse OBD</TabsTrigger>
              <TabsTrigger value="pidInfo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">PID Info</TabsTrigger>
              <TabsTrigger value="processVIN" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Process VIN</TabsTrigger>
              <TabsTrigger value="validateVIN" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Validate VIN</TabsTrigger>
              <TabsTrigger value="isVinData" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Check VIN Data</TabsTrigger>
              <TabsTrigger value="decodeDTC" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Decode DTC</TabsTrigger>
            </TabsList>

            <div className="grid gap-8">
              <TabsContent value="parseOBD">
                <Card className="border-2">
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
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                        Parse Data
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pidInfo">
                <Card className="border-2">
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
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                        Get Info
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="processVIN">
                <Card className="border-2">
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
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                        Process VIN
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="validateVIN">
                <Card className="border-2">
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
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                        Validate VIN
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="isVinData">
                <Card className="border-2">
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
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                        Check Data
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="decodeDTC">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-blue-500"></span>
                      Decode Diagnostic Trouble Codes (DTC)
                    </CardTitle>
                    <CardDescription>Enter DTC data as a JSON array of arrays of numbers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      const data = formData.get('data') as string;
                      const mode = formData.get('mode') as string;
                      const isCan = formData.get('isCan') === 'true';
                      
                      // Validate JSON before submitting
                      try {
                        const jsonData = JSON.parse(data);
                        if (!Array.isArray(jsonData) || !jsonData.every(Array.isArray)) {
                          setResults({
                            status: 'error',
                            error: 'Invalid format. Data must be an array of arrays.'
                          });
                          return;
                        }
                        if (!jsonData.every(arr => arr.every(num => typeof num === 'number'))) {
                          setResults({
                            status: 'error',
                            error: 'Invalid format. All elements must be numbers.'
                          });
                          return;
                        }
                        handleSubmit('decodeDTC', data, mode, isCan);
                      } catch (error) {
                        setResults({
                          status: 'error',
                          error: 'Invalid JSON format. Please check your input.'
                        });
                      }
                    }} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="dtc-mode">DTC Mode</Label>
                          <select 
                            id="dtc-mode" 
                            name="mode" 
                            className="w-full p-2 border rounded-md bg-background"
                            required
                          >
                            <option value="03">Mode 03 - Current DTCs</option>
                            <option value="07">Mode 07 - Pending DTCs</option>
                            <option value="0A">Mode 0A - Permanent DTCs</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dtc-protocol">Protocol Type</Label>
                          <select 
                            id="dtc-protocol" 
                            name="isCan" 
                            className="w-full p-2 border rounded-md bg-background"
                            required
                          >
                            <option value="true">CAN</option>
                            <option value="false">Non-CAN</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dtc-data">
                          DTC Data (JSON array format)
                          <span className="text-sm text-muted-foreground ml-2">Must be a valid JSON array of arrays of numbers</span>
                        </Label>
                        <textarea 
                          id="dtc-data" 
                          name="data" 
                          placeholder='[[52, 51, 48, 49, 48, 49, 48, 49, 49, 51, 13], [13, 62]]'
                          required 
                          className="w-full h-32 p-2 font-mono border rounded-md resize-none bg-background"
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
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                        Decode DTCs
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          {/* Results Section */}
          {loading ? (
            <Card className="w-full mt-8">
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </CardContent>
            </Card>
          ) : results ? (
            <Card className="w-full mt-8 border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Results
                  <Button variant="ghost" size="sm" onClick={() => setResults(null)}>Clear</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{results.error}</AlertDescription>
                  </Alert>
                ) : (
                  <pre className="bg-muted/50 p-4 rounded-lg overflow-auto font-mono text-sm">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          ) : null}
        </main>
      </div>
    </div>
  );
}
