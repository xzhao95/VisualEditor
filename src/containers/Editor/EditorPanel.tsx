import React, { useMemo, useRef } from "react"
import withStyle from "../../utils/withStyle"
// import style from './editor.less'
// import './EditorPanel.less'
import { createVisualBlock, EditorBlock, EditorComponent, EditorConfig, EditorValue } from "./Utils"
import { Block } from "./Block"
import { useCallbackRef } from "../../hook/useCallbackRef"

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

    const focusData = useMemo(() => {
        const focus: EditorBlock[] = [];
        const unfocus: EditorBlock[] = [];

        props.value.blocks.forEach(item => (item.focus ? focus : unfocus).push(item))
        return {
            focus,
            unfocus
        }
    }, [props.value.blocks])

    const methods = {
        updateBlocks: (blocks: EditorBlock[]) => {
            props.onChange({
                ...props.value,
                blocks: [...blocks]
            })
        },
        clearFocus: (external?:EditorBlock) => {
            (!!external ? focusData.focus.filter(item => external !== item) : focusData.focus).forEach(item => item.focus = false)
            methods.updateBlocks(props.value.blocks)
        }
    }

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

    const focusHandler = (() => {
        const blockMouseDown = (e:React.MouseEvent<HTMLDivElement>, block: EditorBlock) => {
            if(e.shiftKey) {
                if(focusData.focus.length <= 1) {
                    block.focus = true
                }else {
                    block.focus = !block.focus
                }
                methods.updateBlocks(props.value.blocks)
            }else {
                block.focus = true;
                methods.clearFocus(block)
            }

        }

        const containerMouseDown = (e:React.MouseEvent<HTMLDivElement>) => {  
            if(e.target !== e.currentTarget) {
                return
            }
            if(!e.shiftKey) {
                methods.clearFocus()
            }
        }

        return {
            block: blockMouseDown,
            container: containerMouseDown
        }
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
                <div className="react-visual-editor-container" style={containerStyles} ref={containerRef} onMouseDown={focusHandler.container}>
                    {props.value.blocks.map((block, index) => (
                        <Block key={index} block={block} config={props.config} onMouseDown={focusHandler.block}></Block>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ReactVisualEditor;