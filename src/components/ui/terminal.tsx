
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SpaceObject, SpaceObjectType } from '@/lib/space-objects';
import { ShieldAlert, Bot, Users, Filter, Info } from 'lucide-react';

interface TerminalProps {
  isOpen: boolean;
  selectedObject: SpaceObject | null;
  scanResults: SpaceObject[];
  playClickSound: () => void;
  filters: Record<SpaceObjectType, boolean>;
  onFilterChange: (objectType: SpaceObjectType, isVisible: boolean) => void;
}

const ObjectDetails = ({ obj }: { obj: SpaceObject }) => (
    <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between items-start">
            <h3 className="font-headline text-lg font-bold">{obj.name}</h3>
            <Badge variant={obj.status === 'Working' ? 'default' : 'destructive'} className={cn(
                obj.status === 'Working' && 'bg-green-500/80 text-white',
                obj.status === 'Defunct' && 'bg-red-500/80 text-white',
                obj.status === 'Natural' && 'bg-yellow-500/80 text-black'
            )}>{obj.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
            <p><span className="font-semibold text-muted-foreground">Type:</span> {obj.type}</p>
            <p><span className="font-semibold text-muted-foreground">Mass:</span> {obj.mass.toFixed(2)} kg</p>
            <p><span className="font-semibold text-muted-foreground">Radius:</span> {obj.size.toFixed(2)} m</p>
            <p><span className="font-semibold text-muted-foreground">Velocity:</span> {Math.sqrt(obj.velocity.reduce((acc, v) => acc + v*v, 0)).toFixed(2)} m/s</p>
        </div>
    </div>
);

const ScanResultItem = ({ obj }: { obj: SpaceObject }) => (
    <div className="p-2 rounded-md bg-muted/30">
        <div className="flex justify-between items-center">
            <span className="font-mono text-xs">{obj.name}</span>
            <Badge variant="outline">{obj.type}</Badge>
        </div>
    </div>
);

export function Terminal({ isOpen, selectedObject, scanResults, playClickSound, filters, onFilterChange }: TerminalProps) {
  const objectTypes: SpaceObjectType[] = ['Satellite', 'Debris', 'Asteroid', 'Comet'];
  
  const handleFilterChangeWithSound = (type: SpaceObjectType, checked: boolean) => {
    onFilterChange(type, checked);
  };
  
  return (
    <div className={cn(
        "absolute bottom-[calc(theme(spacing.4)_+_6rem)] right-4 top-4 w-96 max-w-[calc(100vw-2rem)] transform transition-transform duration-300 ease-in-out md:bottom-4 lg:top-[calc(theme(spacing.4)_+_4rem)]",
        "lg:top-[calc(theme(spacing.16)_+_1.5rem)]",
        isOpen ? "translate-x-0" : "translate-x-[105%]"
    )}>
        <Card className="h-full rounded-lg border-l-2 border-accent/50 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-4 h-full">
                <Tabs defaultValue="data" className="flex flex-col h-full">
                    <TabsList className="grid w-full grid-cols-5 bg-muted/50">
                        <TabsTrigger value="status" onClick={playClickSound}><Info className="mr-2 h-4 w-4" />Status</TabsTrigger>
                        <TabsTrigger value="data" onClick={playClickSound}><Bot className="mr-2 h-4 w-4" />Data</TabsTrigger>
                        <TabsTrigger value="filters" onClick={playClickSound}><Filter className="mr-2 h-4 w-4" />Filters</TabsTrigger>
                        <TabsTrigger value="alarms" onClick={playClickSound}><ShieldAlert className="mr-2 h-4 w-4" />Alarms</TabsTrigger>
                        <TabsTrigger value="multiplayer" onClick={playClickSound}><Users className="mr-2 h-4 w-4" />Mode</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="flex-grow mt-4">
                        <TabsContent value="status" className="m-0">
                             <Card className="bg-transparent border-0 shadow-none">
                                <CardHeader className="p-1">
                                    <CardTitle>Pod Status</CardTitle>
                                    <CardDescription>Real-time ship telemetry and orientation.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-1">
                                    <p className="text-muted-foreground">Gyroscope and telemetry data will be shown here.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="data" className="m-0">
                            <Card className="bg-transparent border-0 shadow-none">
                                <CardHeader className="p-1"><CardTitle>Object Analysis</CardTitle></CardHeader>
                                <CardContent className="p-1 space-y-4">
                                    <div className="mt-2 pt-2 border-t border-border">
                                        <h4 className="mb-2 font-semibold">Selected Object</h4>
                                        <div className="p-3 rounded-md bg-muted/50 min-h-[120px]">
                                            {selectedObject ? <ObjectDetails obj={selectedObject} /> : <p className="text-sm text-muted-foreground">No object selected. Click an object in the scene to analyze.</p>}
                                        </div>
                                    </div>

                                    <div className="mt-2 pt-2 border-t border-border">
                                        <h4 className="mb-2 font-semibold">Scan Results</h4>
                                        <div className="p-3 rounded-md bg-muted/50 min-h-[120px] space-y-2">
                                            {scanResults.length > 0 ? (
                                                scanResults.map(obj => <ScanResultItem key={obj.id} obj={obj} />)
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No objects detected in the last scan. Use the scan tool to find nearby objects.</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="filters" className="m-0">
                            <Card className="bg-transparent border-0 shadow-none">
                                <CardHeader className="p-1">
                                    <CardTitle>Display Filters</CardTitle>
                                    <CardDescription>Configure object visibility on the main screen.</CardDescription>

                                </CardHeader>
                                <CardContent className="p-1 space-y-2">
                                  {objectTypes.map(type => (
                                    <div key={type} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30">
                                        <Label htmlFor={`filter-${type}`} className="text-sm">{type}s</Label>
                                        <Switch
                                            id={`filter-${type}`}
                                            checked={filters[type]}
                                            onCheckedChange={(checked) => handleFilterChangeWithSound(type, checked)}
                                        />
                                    </div>
                                  ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="alarms" className="m-0">
                            <Card className="bg-transparent border-0 shadow-none">
                                <CardHeader className="p-1"><CardTitle>System Alarms</CardTitle></CardHeader>
                                <CardContent className="p-1">
                                    <p className="text-muted-foreground">No active alarms.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="multiplayer" className="m-0">
                            <Card className="bg-transparent border-0 shadow-none">
                                <CardHeader className="p-1">
                                    <CardTitle>Multiplayer Mode</CardTitle>
                                    <CardDescription>Play cooperatively with a friend.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-1 space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch id="multiplayer-mode" onCheckedChange={playClickSound} />
                                        <Label htmlFor="multiplayer-mode">Enable Multiplayer</Label>
                                    </div>
                                    <Button disabled className="w-full" onClick={playClickSound}>Invite Player</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
