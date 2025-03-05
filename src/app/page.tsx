'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Home() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (action: string, data: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/obd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, data }),
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">OBD-II Data Parser</h1>
        
        <Tabs defaultValue="parseOBD" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="parseOBD">Parse OBD</TabsTrigger>
            <TabsTrigger value="pidInfo">PID Info</TabsTrigger>
            <TabsTrigger value="processVIN">Process VIN</TabsTrigger>
            <TabsTrigger value="validateVIN">Validate VIN</TabsTrigger>
            <TabsTrigger value="isVinData">Check VIN Data</TabsTrigger>
          </TabsList>

          <TabsContent value="parseOBD">
            <Card>
              <CardHeader>
                <CardTitle>Parse OBD Response</CardTitle>
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
                    <Input id="obd-data" name="data" placeholder="41 0D 32" required />
                  </div>
                  <Button type="submit" disabled={loading}>Parse Data</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pidInfo">
            <Card>
              <CardHeader>
                <CardTitle>Get PID Information</CardTitle>
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
                    <Input id="pid" name="data" placeholder="0C" required />
                  </div>
                  <Button type="submit" disabled={loading}>Get Info</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processVIN">
            <Card>
              <CardHeader>
                <CardTitle>Process VIN</CardTitle>
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
                    <Input id="vin-data" name="data" placeholder="014\r0:49020157304C\r1:4A443745433247\r2:42353839323737" required />
                  </div>
                  <Button type="submit" disabled={loading}>Process VIN</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validateVIN">
            <Card>
              <CardHeader>
                <CardTitle>Validate VIN</CardTitle>
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
                    <Input id="vin" name="data" placeholder="W0LJD7EC2GB589277" required />
                  </div>
                  <Button type="submit" disabled={loading}>Validate VIN</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="isVinData">
            <Card>
              <CardHeader>
                <CardTitle>Check VIN Data</CardTitle>
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
                    <Input id="vin-check" name="data" placeholder="0902" required />
                  </div>
                  <Button type="submit" disabled={loading}>Check Data</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {results && (
          <Card className="w-full mt-8">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
