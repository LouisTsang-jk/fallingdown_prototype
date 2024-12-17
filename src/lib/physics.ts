import Matter from 'matter-js';
import { WINDOW_WIDTH, OBSTACLE_COUNT } from './constants';
import { Ball } from '@/types';

export function createPhysicsEngine() {
  const engine = Matter.Engine.create({
    gravity: { x: 0, y: 0.5 },
    constraintIterations: 3
  });

  // 设置小球的弹性和摩擦力
  engine.world.gravity.y = 0.5;
  
  return engine;
}

export const generateObstacles = (mapLength: number) => {
  const obstacles = [];
  for (let i = 0; i < OBSTACLE_COUNT; i++) {
    const x = Math.random() * (WINDOW_WIDTH - 100) + 50;
    const y = (mapLength / OBSTACLE_COUNT) * i;
    const width = Math.random() * 100 + 50;
    const height = 20;

    const body = Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      angle: (Math.random() - 0.5) * Math.PI / 4,
    });

    obstacles.push({ body });
  }
  return obstacles;
};

export function createBalls(count: number, size: number): Ball[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    body: Matter.Bodies.circle(
      WINDOW_WIDTH / 2 + (Math.random() - 0.5) * 50, // 随机起始位置
      50,
      size,
      {
        restitution: 0.7, // 弹性
        friction: 0.005,  // 摩擦力
        density: 0.001,   // 密度
        label: `ball-${i + 1}`
      }
    )
  }));
}