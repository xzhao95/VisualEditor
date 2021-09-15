import React, { useMemo, useRef } from "react"
import withStyle from "../../utils/withStyle"
import style from './editor.less'
import './editor.less'
import { createVisualBlock, EditorBlock, EditorComponent, EditorConfig, EditorValue } from "./utils"
import { Block } from "./Block"
import { useCallbackRef } from "../../hook/useCallbackRef"
import e from "express"

const ReactVisualEditor:React.FC<{
    value: EditorValue,
    onChange: (val: EditorValue) => void,
    config: EditorConfig
}> = (props) => {
    // console.log(props);

    const containerRef = useRef({} as HTMLDivElement)

    const containerStyles = useMemo(() => {
        return {
            height: `${props.value.container.height}px`,
            width: `${props.value.container.width}px`
        }
    }, [props.value.container.height, props.value.container.width])

    const menuDragger = (() => {

        const dragData = useRef({
            dragComponent: null as null | EditorComponent
        })

        const block = {
            dragstart: useCallbackRef((e:React.DragEvent<HTMLDivElement>, dragComponent:EditorComponent) => {
                containerRef.current.addEventListener('dragenter', container.dragenter);
                containerRef.current.addEventListener('dragover', container.dragover);
                containerRef.current.addEventListener('dragleave', container.dragleave);
                containerRef.current.addEventListener('drop', container.drop);
                dragData.current.dragComponent = dragComponent
            }),
            dragend: useCallbackRef((e:React.DragEvent<HTMLDivElement>) => {
                containerRef.current.removeEventListener('dragenter', container.dragenter);
                containerRef.current.removeEventListener('dragover', container.dragover);
                containerRef.current.removeEventListener('dragleave', container.dragleave);
                containerRef.current.removeEventListener('drop', container.drop);
            })
        }
        const container = {
            dragenter: useCallbackRef((e:DragEvent) => {e.dataTransfer!.dropEffect = 'move'}),
            dragover: useCallbackRef((e:DragEvent) => {e.preventDefault()}),
            dragleave: useCallbackRef((e:DragEvent) => {e.dataTransfer!.dropEffect = 'none'}),
            drop: useCallbackRef((e:DragEvent) => {
                props.onChange({
                    ...props.value,
                    blocks: [
                        ...props.value.blocks,
                        createVisualBlock({
                            top: e.offsetY,
                            left: e.offsetX,
                            component: dragData.current.dragComponent as EditorComponent
                        })
                    ]
                })
            })
        }

        return block;
    })()

    return (
        <div className="react-visual-editor">
            <div className="react-visual-editor-menu">
                {props.config.componentArray.map((component, index) => (
                    <div className="react-visual-editor-menu-item" key={index} 
                        draggable={true} 
                        onDragStart={(e) => menuDragger.dragstart(e, component)} 
                        onDragEnd={menuDragger.dragend}>
                        {component.preview()}
                        <div className="react-visual-editor-menu-item-name">
                            {component.name}
                        </div>
                    </div>
                ))}
            </div>
            <div className="react-visual-editor-head">head</div>
            <div className="react-visual-editor-operator">operator</div>
            <div className="react-visual-editor-body">
                <div className="react-visual-editor-container" style={containerStyles} ref={containerRef}>
                    {props.value.blocks.map((block, index) => (
                        <Block key={index} block={block} config={props.config}></Block>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ReactVisualEditor;