"use client";

import React, { useState, useEffect, useRef } from 'react';

interface CircuitLinesProps {
  currentEndpointId: string | null;
  isLoading: boolean;
}

export const CircuitLines = ({ currentEndpointId, isLoading }: CircuitLinesProps) => {
  const [svgPaths, setSvgPaths] = useState<React.ReactElement[]>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const renderLoop = () => {
      const outputBox = document.getElementById('output-box');
      const cardElements = Array.from(document.querySelectorAll('[data-card-index]')) as HTMLElement[];

      if (outputBox && cardElements.length > 0) {
        const outputRect = outputBox.getBoundingClientRect();
        const newPaths: React.ReactElement[] = [];
        const busX = outputRect.left - 60;

        const firstCardRect = cardElements[0].getBoundingClientRect();
        const lastCardRect = cardElements[cardElements.length - 1].getBoundingClientRect();
        const busStartY = firstCardRect.top + firstCardRect.height / 2;
        const busEndY = lastCardRect.top + lastCardRect.height / 2;

        newPaths.push(
          <line
            key="bus-line"
            x1={busX} y1={busStartY}
            x2={busX} y2={busEndY}
            stroke="rgba(16, 185, 129, 0.2)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );

        const outputConnectionY = outputRect.top + outputRect.height / 2;
        newPaths.push(
          <line
            key="bus-to-output"
            x1={busX} y1={outputConnectionY}
            x2={outputRect.left} y2={outputConnectionY}
            stroke="rgba(16, 185, 129, 0.4)"
            strokeWidth="2"
            strokeLinecap="round"
          />,
          <circle key="bus-output-node" cx={busX} cy={outputConnectionY} r="3" fill="rgba(16, 185, 129, 0.6)" />
        );

        cardElements.forEach((card) => {
          const cardRect = card.getBoundingClientRect();
          const cardEndpointId = card.parentElement?.getAttribute('data-endpoint-id');
          const isActive = cardEndpointId === currentEndpointId;
          const startX = cardRect.right;
          const startY = cardRect.top + cardRect.height / 2;
          const pathData = `M ${startX},${startY} L ${busX},${startY}`;

          newPaths.push(
            <path
              key={`path-from-${cardEndpointId}`}
              d={pathData}
              stroke={isActive ? '#10b981' : 'rgba(16, 185, 129, 0.4)'}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              style={{
                transition: 'stroke 0.3s ease-out, filter 0.3s ease-out',
                filter: isActive ? 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.7))' : 'none',
              }}
            />
          );
          
          if (isActive && isLoading) {
              const pathLength = busX - startX;
              newPaths.push(
                  <path
                      key={`anim-path-from-${cardEndpointId}`}
                      d={pathData}
                      stroke="#a7f3d0"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      style={{
                          filter: 'drop-shadow(0 0 7px #a7f3d0)',
                          strokeDasharray: `15, ${pathLength}`,
                      }}
                  >
                      <animate
                          attributeName="stroke-dashoffset"
                          from="0"
                          to={-pathLength}
                          dur="1.5s"
                          repeatCount="indefinite"
                      />
                  </path>
              );
          }

          newPaths.push(
              <circle key={`node-on-bus-${cardEndpointId}`} cx={busX} cy={startY} r="3" fill={isActive ? '#10b981' : 'rgba(16, 185, 129, 0.6)'} style={{transition: 'fill 0.3s ease-out', boxShadow: isActive ? '0 0 8px #10b981' : 'none'}}/>
          );
        });
        setSvgPaths(newPaths);
      }
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };
    
    renderLoop();

    return () => {
      if(animationFrameId.current){
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [currentEndpointId, isLoading]);

  return (
    <svg
      className="pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
      }}
    >
      {svgPaths}
    </svg>
  );
}; 