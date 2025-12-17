
'use client';
import { useEffect, useRef, useCallback } from 'react';
import type { ActiveTool, JoystickMode } from '@/components/game/orbital-sync-app';

interface GameControlsProps {
    targetRef: React.RefObject<HTMLElement>;
    updateThrottleSound?: (thrust: number) => void;
    activeTool: ActiveTool;
    joystickMode: JoystickMode;
    onScan: () => void;
}

export const useGameControls = ({
    targetRef,
    updateThrottleSound,
    activeTool,
    joystickMode,
    onScan,
}: GameControlsProps) => {
    const moveState = useRef({ 
        forward: false, backward: false, left: false, right: false, up: false, down: false,
        rollLeft: false, rollRight: false,
        joystick: { x: 0, y: 0 }
    });
    const lookState = useRef({ dx: 0, dy: 0, joystick: { x: 0, y: 0 } });
    const mouseState = useRef({ isLooking: false, isDragging: false });
    const lastClick = useRef({ x: 0, y: 0, isDrag: false, dragThreshold: 5 });
    
    const toolState = useRef({
        scanRequested: false,
        magnetActive: false,
        burnerActive: false,
    });

    const updateThrottleFromState = useCallback(() => {
        if (!updateThrottleSound) return;

        const { forward, backward, left, right, up, down, joystick } = moveState.current;
        const keyMoving = forward || backward || left || right || up || down;
        const joystickMoving = joystick.x !== 0 || joystick.y !== 0;
        
        let thrust = 0;
        if (keyMoving) {
            thrust = 1;
        } else if (joystickMoving) {
            thrust = Math.max(Math.abs(joystick.x), Math.abs(joystick.y));
        }

        updateThrottleSound(thrust);
    }, [updateThrottleSound]);

    const handlePointerDown = useCallback((e: PointerEvent) => {
        if (e.target instanceof HTMLElement && e.target.closest('.pointer-events-auto')) {
          return;
        }
        e.preventDefault();
        lastClick.current.isDrag = false;
        
        lastClick.current.x = e.clientX;
        lastClick.current.y = e.clientY;
        
        // Left Click / Tap
        if (e.button === 0) { 
            // If a tool is active, the left click activates it.
            if (activeTool) {
                switch(activeTool) {
                    case 'Scan':
                        if (!toolState.current.scanRequested) {
                            toolState.current.scanRequested = true;
                            onScan();
                        }
                        break;
                    case 'Magnet':
                        toolState.current.magnetActive = true;
                        break;
                    case 'Burner':
                        toolState.current.burnerActive = true;
                        break;
                }
            }
            // If no tool is active, left click is for selection or dragging to look.
            else {
                mouseState.current.isDragging = true;
            }
        } 
        // Right or Middle click is ALWAYS for looking, regardless of other modes.
        else if (e.button === 2 || e.button === 1) { 
            mouseState.current.isLooking = true;
        }
    }, [activeTool, onScan]);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        // Only set isDrag if movement exceeds a threshold and left button is down
        if (e.buttons === 1 && !lastClick.current.isDrag) {
            const dx = e.clientX - lastClick.current.x;
            const dy = e.clientY - lastClick.current.y;
            if (Math.sqrt(dx*dx + dy*dy) > lastClick.current.dragThreshold) {
                lastClick.current.isDrag = true;
            }
        }

        // Determine if we should be looking
        const shouldLook = (e.buttons === 1 && lastClick.current.isDrag && !activeTool) || (e.buttons === 2 || e.buttons === 4);

        if (shouldLook) {
            lookState.current.dx += e.movementX;
            lookState.current.dy += e.movementY;
        }
    }, [activeTool]);

    const handlePointerUp = useCallback((e: PointerEvent) => {
         if (e.button === 0) { // Left click released
            // Deactivate any tools that are active on press
            toolState.current.burnerActive = false;
            toolState.current.magnetActive = false;
            
            // If it was a click (not a drag) and no tool was active, it's for object selection
            if (!lastClick.current.isDrag && !activeTool) {
                (window as any)._clickRequest = true;
            }
            mouseState.current.isDragging = false;
         }
        
        if (e.button === 2 || e.button === 1) { // Right or Middle click released
            mouseState.current.isLooking = false;
        }
    }, [activeTool]);

    const handleContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
    }, []);
    
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            return;
        }
        let isMovingNow = false;

        switch (e.code) {
            case 'KeyW': case 'ArrowUp': if (!moveState.current.forward) { moveState.current.forward = true; isMovingNow = true; } break;
            case 'KeyS': case 'ArrowDown': if (!moveState.current.backward) { moveState.current.backward = true; isMovingNow = true; } break;
            case 'KeyA': case 'ArrowLeft': if (!moveState.current.left) { moveState.current.left = true; isMovingNow = true; } break;
            case 'KeyD': case 'ArrowRight': if (!moveState.current.right) { moveState.current.right = true; isMovingNow = true; } break;
            case 'KeyQ': moveState.current.rollLeft = true; break;
            case 'KeyE': moveState.current.rollRight = true; break;
            case 'Space': if (!moveState.current.up) { moveState.current.up = true; isMovingNow = true; } break;
            case 'ShiftLeft': case 'ControlLeft': if (!moveState.current.down) { moveState.current.down = true; isMovingNow = true; } break;
        }
        if (isMovingNow) {
          updateThrottleFromState();
        }
    }, [updateThrottleFromState]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        switch (e.code) {
            case 'KeyW': case 'ArrowUp': moveState.current.forward = false; break;
            case 'KeyS': case 'ArrowDown': moveState.current.backward = false; break;
            case 'KeyA': case 'ArrowLeft': moveState.current.left = false; break;
            case 'KeyD': case 'ArrowRight': moveState.current.right = false; break;
            case 'KeyQ': moveState.current.rollLeft = false; break;
            case 'KeyE': moveState.current.rollRight = false; break;
            case 'Space': moveState.current.up = false; break;
            case 'ShiftLeft': case 'ControlLeft': moveState.current.down = false; break;
        }
        updateThrottleFromState();
    }, [updateThrottleFromState]);

    useEffect(() => {
        const targetElement = targetRef.current;
        if (!targetElement) return;

        targetElement.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        targetElement.addEventListener('contextmenu', handleContextMenu);
        
        return () => {
            targetElement.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            targetElement.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [targetRef, handlePointerDown, handlePointerMove, handlePointerUp, handleKeyDown, handleKeyUp, handleContextMenu]);
    
    const setMoveJoystickState = useCallback((x: number, y: number) => {
        moveState.current.joystick = { x, y };
        updateThrottleFromState();
    }, [updateThrottleFromState]);

    const setLookJoystickState = useCallback((x: number, y: number) => {
        lookState.current.joystick = { x, y };
    }, []);

    const getState = useCallback(() => ({
        moveState: { ...moveState.current },
        lookState: { ...lookState.current },
        toolState: { ...toolState.current },
        lastClick: { ...lastClick.current },
    }), []);

    const resetMouseDelta = useCallback(() => {
        lookState.current.dx = 0;
        lookState.current.dy = 0;
    }, []);
    
    const resetScanRequest = useCallback(() => {
      toolState.current.scanRequested = false;
    }, []);

    return { 
        getState, 
        resetMouseDelta, 
        resetScanRequest, 
        setMoveJoystickState,
        setLookJoystickState,
    };
};
