import * as React from "react";

const Y_OFFSET = 16;
const TOOLTIP_WIDTH = 160; // w-40 = 160px
const EDGE_THRESHOLD = 80; // distance from right edge to trigger flip

const useChartTooltip = () => {
  const [tooltipState, setTooltipState] = React.useState<{ x: number; y: number; index: number; flipX?: boolean } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const dots: SVGCircleElement[] = [];

  return {
    tooltip: tooltipState
      ? {
          index: tooltipState.index,
          position: {
            left: tooltipState.flipX ? tooltipState.x - TOOLTIP_WIDTH : tooltipState.x,
            top: tooltipState.y - Y_OFFSET,
          },
        }
      : null,

    containerRef,
    dotRef: (element: SVGCircleElement) => dots.push(element),

    events: {
      onMouseMove: (e: { activeTooltipIndex?: number }) => {
        if (e.activeTooltipIndex == null) {
          setTooltipState(null);
          return;
        }

        const dotRect = dots[e.activeTooltipIndex]?.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!dotRect || !containerRect) {
          setTooltipState(null);
          return;
        }
        const x = dotRect.x - containerRect.x + dotRect.width / 2;
        const y = dotRect.y - containerRect.y + dotRect.height / 2;
        
        // Check if tooltip would overflow right edge
        const containerWidth = containerRect.width;
        const distanceFromRight = containerWidth - x;
        const flipX = distanceFromRight < EDGE_THRESHOLD;
        
        setTooltipState({ x, y, index: e.activeTooltipIndex, flipX });
      },
      onMouseLeave: () => setTooltipState(null),
    },
  };
};

export default useChartTooltip;
