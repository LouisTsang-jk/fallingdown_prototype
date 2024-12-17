import { Container, Graphics, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Ball, Obstacle } from '@/types';
import { WINDOW_WIDTH } from '@/lib/constants';

interface GameRendererProps {
  balls: Ball[];
  obstacles: Obstacle[];
  mapLength: number;
  ballSize: number;
  cameraY: number;
}

export function GameRenderer({
  balls,
  obstacles,
  mapLength,
  ballSize,
  cameraY,
}: GameRendererProps) {
  const drawBall = (g: PIXI.Graphics, ball: Ball) => {
    g.beginFill(0xff0000);
    g.drawCircle(ball.body.position.x, ball.body.position.y - cameraY, ballSize);
    g.endFill();
  };

  const drawObstacle = (g: PIXI.Graphics, obstacle: Obstacle) => {
    const vertices = obstacle.body.vertices;
    g.beginFill(0x00ff00);
    g.moveTo(vertices[0].x, vertices[0].y - cameraY);
    for (let i = 1; i < vertices.length; i++) {
      g.lineTo(vertices[i].x, vertices[i].y - cameraY);
    }
    g.lineTo(vertices[0].x, vertices[0].y - cameraY);
    g.endFill();
  };

  return (
    <Container>
      <Graphics
        draw={g => {
          g.clear();
          balls.forEach(ball => drawBall(g, ball));
          obstacles.forEach(obstacle => drawObstacle(g, obstacle));
          
          // Draw finish line
          g.beginFill(0x0000ff, 0.3);
          g.drawRect(0, mapLength - cameraY, WINDOW_WIDTH, 20);
          g.endFill();
        }}
      />
      {balls.map(ball => (
        <Text
          key={ball.id}
          text={ball.id.toString()}
          x={ball.body.position.x - 5}
          y={ball.body.position.y - cameraY - 7}
          style={{
            fontSize: 14,
            fill: 0xffffff,
          }}
        />
      ))}
    </Container>
  );
}