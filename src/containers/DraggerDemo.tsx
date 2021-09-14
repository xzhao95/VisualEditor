import React, { ReactEventHandler, useRef, useState } from 'react';

export default () => {
    const [pos, setPos] = useState({
        left: 0,
        top: 0
    })

    const moveDraggier = (() => {
        const dragData = useRef({
            startTop: 0,
            startLeft: 0,
            startX: 0,
            startY: 0
        })

        const mouseDown= (e:React.MouseEvent<HTMLDivElement>) => {
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp)
            dragData.current = {
                startTop: pos.top,
                startLeft: pos.left,
                startX: e.clientX,
                startY: e.clientY
            }
        }

        const mouseMove = (e:MouseEvent) => {
            const {startTop, startLeft, startX, startY} = dragData.current;
            const diffX = e.clientX - startX;
            const diffY = e.clientY - startY;

            setPos({
                top: startTop + diffY,
                left: startLeft + diffX
            })
        }

        const mouseUp = (e:MouseEvent) => {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }

        return {
            mouseDown
        }
    })()

    return (
        <div>
            <h1>Hello World</h1>
            <div 
                style={
                    {
                        position: 'relative',
                        top: `${pos.top}px`,
                        left: `${pos.left}px`,
                        width: '50px',
                        height: '50px',
                        background: 'red'
                    }
                }
                onMouseDown={moveDraggier.mouseDown}
            ></div>
        </div>
    )
}