import Matter from 'matter-js';
import { WINDOW_WIDTH, OBSTACLE_COUNT, MOVING_OBSTACLE_COUNT } from './constants';
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
  
  // 静态障碍物
  for (let i = 0; i < OBSTACLE_COUNT; i++) {
    const x = Math.random() * (WINDOW_WIDTH - 100) + 50;
    const y = (mapLength / OBSTACLE_COUNT) * i;
    const width = Math.random() * 100 + 50;
    const height = 20;

    const body = Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      angle: (Math.random() - 0.5) * Math.PI / 4,
      label: 'static-obstacle'
    });

    obstacles.push({ 
      body,
      isMoving: false 
    });
  }

  // 移动障碍物
  for (let i = 0; i < MOVING_OBSTACLE_COUNT; i++) {
    const x = Math.random() * (WINDOW_WIDTH - 100) + 50;
    const y = (mapLength / MOVING_OBSTACLE_COUNT) * i + 200; // 错开一些距离
    const width = 80;
    const height = 20;

    const body = Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      angle: 0,
      label: 'moving-obstacle'
    });

    obstacles.push({ 
      body,
      isMoving: true,
      direction: 1, // 1 表示向右, -1 表示向左
      startX: x,
      range: 150 // 移动范围
    });
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