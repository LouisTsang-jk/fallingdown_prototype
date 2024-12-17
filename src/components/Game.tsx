import { Stage } from '@pixi/react';
import { useEffect, useState } from 'react';
import Matter from 'matter-js';
import { GameControls } from './GameControls';
import { GameRenderer } from './GameRenderer';
import { WinnerDisplay } from './WinnerDisplay';
import { createPhysicsEngine, generateObstacles, createBalls } from '@/lib/physics';
import { WINDOW_WIDTH, WINDOW_HEIGHT, DEFAULT_MAP_LENGTH, DEFAULT_BALL_COUNT, DEFAULT_BALL_SIZE } from '@/lib/constants';
import type { Ball, Obstacle } from '@/types';

export function Game() {
  const [engine] = useState(createPhysicsEngine);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [mapLength, setMapLength] = useState(DEFAULT_MAP_LENGTH);
  const [ballCount, setBallCount] = useState(DEFAULT_BALL_COUNT);
  const [ballSize, setBallSize] = useState(DEFAULT_BALL_SIZE);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [cameraY, setCameraY] = useState(0);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const BALLS_PER_BATCH = 2; // 每批发射的小球数量

  useEffect(() => {
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
    };
  }, [engine]);

  const handleStart = () => {
    Matter.World.clear(engine.world, false);
    
    const newObstacles = generateObstacles(mapLength);
    const newBalls = createBalls(ballCount, ballSize);
    
    setObstacles(newObstacles);
    setBalls(newBalls);
    
    // 添加边界墙
    const walls = [
      // 左墙
      Matter.Bodies.rectangle(-10, mapLength/2, 20, mapLength, { 
        isStatic: true,
        label: 'wall'
      }),
      // 右墙
      Matter.Bodies.rectangle(WINDOW_WIDTH + 10, mapLength/2, 20, mapLength, { 
        isStatic: true,
        label: 'wall'
      })
    ];
    
    Matter.World.add(engine.world, [
      ...walls,
      ...newObstacles.map(o => o.body),
      Matter.Bodies.rectangle(WINDOW_WIDTH / 2, mapLength + 50, WINDOW_WIDTH, 100, { 
        isStatic: true,
        label: 'finish-line'
      })
    ]);

    setGameStarted(true);
    setWinner(null);
    setCameraY(0);
    setCurrentBatchIndex(0);
  };

  const handleReset = () => {
    Matter.World.clear(engine.world, false);
    setGameStarted(false);
    setWinner(null);
    setBalls([]);
    setObstacles([]);
    setCameraY(0);
  };

  useEffect(() => {
    if (!gameStarted) return;

    const checkCollisions = () => {
      const lowestBall = balls.reduce((lowest, current) => {
        return current.body.position.y > lowest.body.position.y ? current : lowest;
      }, balls[0]);

      setCameraY(Math.max(0, lowestBall.body.position.y - WINDOW_HEIGHT / 2));

      engine.world.bodies.forEach(body => {
        if (body.label === 'finish-line') {
          balls.forEach(ball => {
            if (Matter.Collision.collides(ball.body, body, undefined) && !winner) {
              setWinner(ball.id);
            }
          });
        }
      });
    };

    const interval = setInterval(checkCollisions, 16);
    return () => clearInterval(interval);
  }, [gameStarted, balls, engine.world, winner]);

  // 添加新的 useEffect 来处理分批发射
  useEffect(() => {
    if (!gameStarted || currentBatchIndex >= Math.ceil(balls.length / BALLS_PER_BATCH)) return;

    const startIndex = currentBatchIndex * BALLS_PER_BATCH;
    const endIndex = Math.min(startIndex + BALLS_PER_BATCH, balls.length);
    const currentBatch = balls.slice(startIndex, endIndex);

    // 添加当前批次的小球
    Matter.World.add(engine.world, currentBatch.map(b => b.body));

    // 1.5秒后发射下一批
    const timer = setTimeout(() => {
      setCurrentBatchIndex(prev => prev + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [gameStarted, currentBatchIndex, balls, engine.world]);

  return (
    <div className="flex gap-4">
      <div className="w-64">
        <GameControls
          mapLength={mapLength}
          ballCount={ballCount}
          ballSize={ballSize}
          onMapLengthChange={setMapLength}
          onBallCountChange={setBallCount}
          onBallSizeChange={setBallSize}
          onStart={handleStart}
          onReset={handleReset}
        />
        <WinnerDisplay winner={winner} />
      </div>
      <Stage width={WINDOW_WIDTH} height={WINDOW_HEIGHT}>
        <GameRenderer
          balls={balls}
          obstacles={obstacles}
          mapLength={mapLength}
          ballSize={ballSize}
          cameraY={cameraY}
        />
      </Stage>
    </div>
  );
}