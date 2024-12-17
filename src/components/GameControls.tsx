import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GameControlsProps {
  mapLength: number;
  ballCount: number;
  ballSize: number;
  onMapLengthChange: (value: number) => void;
  onBallCountChange: (value: number) => void;
  onBallSizeChange: (value: number) => void;
  onStart: () => void;
  onReset: () => void;
}

export function GameControls({
  mapLength,
  ballCount,
  ballSize,
  onMapLengthChange,
  onBallCountChange,
  onBallSizeChange,
  onStart,
  onReset,
}: GameControlsProps) {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mapLength">Map Length (pixels)</Label>
        <Input
          id="mapLength"
          type="number"
          value={mapLength}
          onChange={(e) => onMapLengthChange(Number(e.target.value))}
          min={1000}
          max={10000}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ballCount">Number of Balls</Label>
        <Input
          id="ballCount"
          type="number"
          value={ballCount}
          onChange={(e) => onBallCountChange(Number(e.target.value))}
          min={1}
          max={10}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ballSize">Ball Size</Label>
        <Input
          id="ballSize"
          type="number"
          value={ballSize}
          onChange={(e) => onBallSizeChange(Number(e.target.value))}
          min={10}
          max={50}
        />
      </div>
      <div className="space-x-2">
        <Button onClick={onStart}>Start Game</Button>
        <Button variant="outline" onClick={onReset}>Reset</Button>
      </div>
    </Card>
  );
}