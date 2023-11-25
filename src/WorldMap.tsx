import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { DIMENSIONS, SQUARE_DIMS, POINT_RADIUS, CONNECT_DIST } from "./constants";

const emptyGrid = new Array(DIMENSIONS ** 2).fill(null);

const GridContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Point = styled.div<{ x: number; y: number }>`
  position: absolute;
  width: ${POINT_RADIUS}px;
  height: ${POINT_RADIUS}px;
  background-color: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
`;

const generateRandomGrid = (): number[] => {
    // This creates a new array with a length of DIMENSIONS ** 2 and fills it with zeros.
    // Then,  Math.random() generates a random decimal between 0 (inclusive) and 1 (exclusive),
    // and Math.round() rounds that decimal to either 0 or 1.
    return new Array(DIMENSIONS ** 2).fill(0).map(() => Math.round(Math.random()));};

const calculateDistance = (
    point1: { x: number; y: number },
    point2: { x: number; y: number }): number => 
    {return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);};

const kruskalMST = (points: { x: number; y: number }[]): { x1: number; y1: number; x2: number; y2: number }[] => {
    // Create a disjoint-set data structure for union-find operations
  class DisjointSet {
      parent: number[];

      constructor(size: number) {
          this.parent = new Array(size).fill(-1);
      }

      find = (x: number): number => {
          if (this.parent[x] === -1) {
              return x;
          } else {
              return this.find(this.parent[x]);
          }
      };

      union = (x: number, y: number): void => {
          const rootX = this.find(x);
          const rootY = this.find(y);

          if (rootX !== rootY) {
              this.parent[rootX] = rootY;
          }
      };
  }

  // Create a list of edges with weights
  const edges: { from: number; to: number; weight: number }[] = [];

  for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
          const distance = calculateDistance(points[i], points[j]);

          edges.push({ from: i, to: j, weight: distance });
      }
  }

  // Sort the edges by weight in ascending order
  edges.sort((a, b) => a.weight - b.weight);

  // Create a disjoint-set for union-find operations
  const disjointSet = new DisjointSet(points.length);

  // Resultant minimum spanning tree
  const mst: { x1: number; y1: number; x2: number; y2: number }[] = [];

  // Iterate through sorted edges and add to MST if it doesn't create a cycle
  for (const edge of edges) {
      const root1 = disjointSet.find(edge.from);
      const root2 = disjointSet.find(edge.to);

      if (root1 !== root2) {
          disjointSet.union(edge.from, edge.to);

          mst.push({
              x1: points[edge.from].x, y1: points[edge.from].y,
              x2: points[edge.to].x, y2: points[edge.to].y,
          });
      }
  }

  return mst;
};

const connectPoints = (points: { x: number; y: number }[]): { x1: number; y1: number; x2: number; y2: number }[] => {
  // Use Kruskal's algorithm to get the MST
  const mst = kruskalMST(points);

  // Additional connections between close points
  const additionalConnections: { x1: number; y1: number; x2: number; y2: number }[] = [];

  for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
          const distance = calculateDistance(points[i], points[j]);

          if (distance < CONNECT_DIST) {
              additionalConnections.push({
                  x1: points[i].x, y1: points[i].y,
                  x2: points[j].x, y2: points[j].y,
              });
          }
      }
  }

  // Combine MST and additional connections for the final set of connections
  const allConnections = [...mst, ...additionalConnections];

  return allConnections;
};

const GraphContainer = styled.div`
  position: relative;
  width: ${DIMENSIONS * SQUARE_DIMS}px;
  height: ${DIMENSIONS * SQUARE_DIMS}px;
  margin: auto;
`;
const RandomWorldMap: React.FC = () => {
    // State to manage the grid and points
    const [grid, setGrid] = useState(generateRandomGrid());
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  
    // Effect to update points whenever the grid changes
    useEffect(() => {
      // Convert the grid into an array of points with random offsets within each tile
      const newPoints = grid
        .map((value, index) => {
          const row = Math.floor(index / DIMENSIONS);
          const col = index % DIMENSIONS;
  
          if (value === 1) {
            // Calculate random offsets within the tile
            const xOffset = Math.random() * (SQUARE_DIMS / 1.5);
            const yOffset = Math.random() * (SQUARE_DIMS / 1.5);
  
            // Calculate the new coordinates with random offsets
            const x = col * SQUARE_DIMS + SQUARE_DIMS / 1.5 - xOffset;
            const y = row * SQUARE_DIMS + SQUARE_DIMS / 1.5 - yOffset;
  
            return { x, y };
          } else {
            return null;
          }
        })
        .filter((point) => point !== null) as { x: number; y: number }[];
  
      // Set the points state with the new array of points
      setPoints(newPoints);
    }, [grid]);
  
    // Calculate connections between close points
    const connections = connectPoints(points);
  
    // Render the component
  return (
    <GraphContainer>
      <GridContainer>
        {/* Render points as circles on the grid */}
        {points.map((point, index) => (
          <Point key={index} x={point.x} y={point.y} />
        ))}
        {/* Render connections as SVG lines */}
        <svg
          height={DIMENSIONS * SQUARE_DIMS}
          width={DIMENSIONS * SQUARE_DIMS}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {connections.map((connection, index) => (
            <line
              key={index}
              x1={connection.x1}
              y1={connection.y1}
              x2={connection.x2}
              y2={connection.y2}
              stroke="gray"
            />
          ))}
        </svg>
      </GridContainer>
    </GraphContainer>
  );
};
  
export default RandomWorldMap;