import Matter from 'matter-js';

export interface Ball {
  id: number;
  body: Matter.Body;
}

export interface Obstacle {
  body: Matter.Body;
}