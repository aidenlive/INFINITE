import { useRef, useCallback, useEffect } from 'react';
import { useCanvasStore } from '../store/canvasStore';

interface UseCanvasGesturesProps {
  onPanStart?: () => void;
  onPanEnd?: () => void;
}

export const useCanvasGestures = ({ onPanStart, onPanEnd }: UseCanvasGesturesProps = {}) => {
  const { viewport, setViewport, setPanning, clearSelection } = useCanvasStore();
  
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number>();

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    // Pinch to zoom (trackpad)
    if (e.ctrlKey) {
      const zoomDelta = -e.deltaY * 0.01;
      const newZoom = Math.min(Math.max(viewport.zoom + zoomDelta, 0.1), 5);
      
      // Zoom towards cursor position
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomRatio = newZoom / viewport.zoom;
      const newX = mouseX - (mouseX - viewport.x) * zoomRatio;
      const newY = mouseY - (mouseY - viewport.y) * zoomRatio;

      setViewport({ zoom: newZoom, x: newX, y: newY });
    } else {
      // Pan with trackpad/mouse wheel
      setViewport({
        x: viewport.x - e.deltaX,
        y: viewport.y - e.deltaY,
      });
    }
  }, [viewport, setViewport]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Only start panning on middle click or when space is held
    if (e.button === 1 || e.button === 0) {
      isDragging.current = true;
      lastPosition.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: 0, y: 0 };
      setPanning(true);
      onPanStart?.();
    }
  }, [setPanning, onPanStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - lastPosition.current.x;
    const deltaY = e.clientY - lastPosition.current.y;

    velocity.current = { x: deltaX, y: deltaY };

    setViewport({
      x: viewport.x + deltaX,
      y: viewport.y + deltaY,
    });

    lastPosition.current = { x: e.clientX, y: e.clientY };
  }, [viewport, setViewport]);

  const applyInertia = useCallback(() => {
    if (Math.abs(velocity.current.x) < 0.1 && Math.abs(velocity.current.y) < 0.1) {
      return;
    }

    velocity.current.x *= 0.95;
    velocity.current.y *= 0.95;

    setViewport({
      x: viewport.x + velocity.current.x,
      y: viewport.y + velocity.current.y,
    });

    animationFrame.current = requestAnimationFrame(applyInertia);
  }, [viewport, setViewport]);

  const handleMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      setPanning(false);
      onPanEnd?.();
      
      // Apply inertia
      if (Math.abs(velocity.current.x) > 1 || Math.abs(velocity.current.y) > 1) {
        applyInertia();
      }
    }
  }, [setPanning, onPanEnd, applyInertia]);

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return {
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
