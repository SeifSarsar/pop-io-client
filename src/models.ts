export class Edge {
  p1: Point;
  p2: Point;
}

export class Point {
  x: number;
  y: number;
}

export class Corner {
  position: Point;
  edge1: Edge;
  edge2: Edge;
}

export class Vector {
  dX: number;
  dY: number;
}

export class Wall {
  edges: Edge[];
}

export class Blob {
  color: string;
  position: Point;
  size: number;
}

export class Globe extends Blob {
  id: string;
  shieldStart: number;
  shieldEnd: number;
  borderColor: string;
  shieldOffset: number;
  username: string;
}

export class Splash {
  lines: Edge[];
  color: string;
}
