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
    return new Array(DIMENSIONS ** 2).fill(0).map(() => Math.round(Math.random()*(2/3)));};

const calculateDistance = (
    point1: { x: number; y: number },
    point2: { x: number; y: number }): number => 
    {return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);};

const connectClosePoints = (points: { x: number; y: number }[]): { x1: number; y1: number; x2: number; y2: number }[] => {
    const connections: { x1: number; y1: number; x2: number; y2: number }[] = [];
    
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
        const distance = calculateDistance(points[i], points[j]);
    
        if (distance < CONNECT_DIST) {
            connections.push({
            x1: points[i].x, y1: points[i].y,
            x2: points[j].x, y2: points[j].y,
            });
        }
        }
    }
    
    return connections;
    };

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
            const xOffset = Math.random() * (SQUARE_DIMS / 2);
            const yOffset = Math.random() * (SQUARE_DIMS / 2);
  
            // Calculate the new coordinates with random offsets
            const x = col * SQUARE_DIMS + SQUARE_DIMS / 2 - xOffset;
            const y = row * SQUARE_DIMS + SQUARE_DIMS / 2 - yOffset;
  
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
    const connections = connectClosePoints(points);
  
    // Render the component
    return (
      <GridContainer>
        {/* Render points as circles on the grid */}
        {points.map((point, index) => (
          <Point key={index} x={point.x} y={point.y} />
        ))}
        {/* Render connections as SVG lines */}
        {connections.map((connection, index) => (
          <svg key={index} height="100%" width="100%" style={{ position: "absolute" }}>
            <line x1={connection.x1} y1={connection.y1} x2={connection.x2} y2={connection.y2} stroke="black" />
          </svg>
        ))}
      </GridContainer>
    );
  };
  
export default RandomWorldMap;