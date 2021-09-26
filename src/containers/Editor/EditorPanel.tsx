import React, { useMemo, useRef, useState } from "react"
import withStyle from "../../utils/withStyle"
// import style from './editor.less'
// import './EditorPanel.less'
import { createVisualBlock, EditorBlock, EditorComponent, EditorConfig, EditorValue } from "./Utils"
import { Block } from "./Block"
import { useCallbackRef } from "../../hook/useCallbackRef"
import { useVisualCommand } from "./Command"
import { createEvent } from "../../plugin/event"
import classNames from "classnames"
import {$$dialog} from "../../service/dialog/$$dialog"
import { notification } from "antd"
import { $$dropdown, DropdownItem } from "../../service/dropdown/$$dropdown"
import { BlockResize, BlockResizeDirection } from "../../component/BlockResize"
import deepcopy from "deepcopy"
import EditorOperator from "./EditorOperator"

const ReactVisualEditor:React.FC<{
    value: EditorValue,
    onChange: (val: EditorValue) => void,
    config: EditorConfig
}> = (props) => {
    // console.log(props);

    const containerRef = useRef({} as HTMLDivElement);
    const bodyRef = useRef({} as HTMLDivElement);

    const [preview, setPreview] = useState(false);
    const [editing, setEditing] = useState(false);

    const [selectBlockIndex, setSelectBlockIndex] = useState(-1);

    const [dragstart] = useState(() => createEvent());
    const [dragend] = useState(() => createEvent());

    const selectBlock = useMemo(() => props.value.blocks[selectBlockIndex] as EditorBlock | undefined, [selectBlockIndex])

    const classes = useMemo(() => {
        return classNames([
            'react-visual-editor',
            {
                'react-visual-editor-preview': preview
            }
        ])
    }, [preview])

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
        updateValue: (value:EditorValue) => {
            props.onChange({...value});
        },
        updateBlocks: (blocks: EditorBlock[]) => {
            props.onChange({
                ...props.value,
                blocks: [...blocks]
            })
        },
        clearFocus: (external?:EditorBlock) => {
            (!!external ? focusData.focus.filter(item => external !== item) : focusData.focus).forEach(item => item.focus = false)
            methods.updateBlocks(props.value.blocks)
        },
        showBlockData: (block:EditorBlock) => {
            $$dialog.textarea(JSON.stringify(block), {editReadonly: true, title: '节点的数据'})
        },
        importBlockData: async (block:EditorBlock) => {
            const text = await $$dialog.textarea('', {title: '请输入导入的节点内容JSON数据'});
            try {
                const data = JSON.parse(text || '');
                commander.updateBlock(data, block);
            }catch(e) {
                console.log(e);
                notification.open({
                    message: '导入失败',
                    description: '导入的数据格式不正常，请检查'
                })
            }
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
                dragData.current.dragComponent = dragComponent;
                dragstart.emit();
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
                methods.updateBlocks([
                    ...props.value.blocks,
                    createVisualBlock({
                        top: e.offsetY,
                        left: e.offsetX,
                        component: dragData.current.dragComponent as EditorComponent
                    })
                ]);
                setTimeout(() => dragend.emit())
            })
        }

        return block;
    })()

    const focusHandler = (() => {
        const blockMouseDown = (e:React.MouseEvent<HTMLDivElement>, block: EditorBlock, index: number) => {
            if(preview) return;
            if(e.button == 2) return
            if(e.shiftKey) {
                if(focusData.focus.length <= 1) {
                    block.focus = true
                }else {
                    block.focus = !block.focus
                }
                methods.updateBlocks(props.value.blocks)
            }else {
                if(!block.focus) {
                    block.focus = true;
                    methods.clearFocus(block)
                }
            }

            setSelectBlockIndex(block.focus ? index : -1)
            setTimeout(() => blockDragger.mouseDown(e, block))
        }

        const containerMouseDown = (e:React.MouseEvent<HTMLDivElement>) => {  
            if(e.target !== e.currentTarget) {
                return
            }
            if(!e.shiftKey) {
                methods.clearFocus()
                setSelectBlockIndex(-1)
            }
        }

        return {
            block: blockMouseDown,
            container: containerMouseDown
        }
    })()

    const blockDragger = (() => {
        const [mark, setMark] = useState({x: null as null | number, y: null as null | number})
        const dragData = useRef({
            startX: 0,    // 拖拽开始时，鼠标的left
            startY: 0,    // 拖拽开始时，鼠标的top
            moveX: 0,
            moveY: 0,
            shiftKey: false,
            body: {
                startScrollTop: 0,
                moveScrollTop: 0   
            },
            startTop: 0,  // 拖拽开始时，拖拽block的top
            startLeft: 0, // 拖拽开始时，拖拽block的left
            startPositions: [] as {top: number, left: number}[],  // 拖拽开始时，所有选中的block元素的top值以及left值
            dragging: false,  // 当前是否是拖拽状态
            markLines: {
                x: [] as {left: number, showLeft: number}[],
                y: [] as {top: number, showTop: number}[]
            }
        })

        const handleMove = useCallbackRef(() => {
            if(!dragData.current.dragging) {
                dragData.current.dragging = true;
                dragstart.emit();
            }
            
            let {startX, startY, moveX, moveY, shiftKey, body, startTop, startLeft, startPositions, markLines} = dragData.current;
            moveY = moveY + body.moveScrollTop - body.startScrollTop;

            if(shiftKey) {
                if(Math.abs(moveX - startX) > Math.abs(moveY - startY)) {
                    moveY = startY
                }else {
                    moveX = startX
                }
            }
            
            const now = {
                mark: {
                    x: null as null | number,
                    y: null as null | number,
                },
                top: startTop + moveY - startY,
                left: startLeft + moveX - startX
            }

            for(let i = 0; i < markLines.y.length; i ++) {
                const {top, showTop} = markLines.y[i];
                if(Math.abs(now.top - top) < 5) {
                    moveY = top - startTop + startY;
                    now.mark.y = showTop
                }
            }

            for(let i = 0; i < markLines.x.length; i ++) {
                const {left, showLeft} = markLines.x[i];
                if(Math.abs(now.left - left) < 5) {
                    moveX = left - startLeft + startX;
                    now.mark.x = showLeft
                }
            }

            
            const diffX = moveX - startX, diffY = moveY - startY;
            
            focusData.focus.forEach((block, index) => {
                block.top = startPositions[index].top + diffY;
                block.left = startPositions[index].left + diffX;
            });

            methods.updateBlocks(props.value.blocks);
            setMark(now.mark)
        })

        const mouseDown = useCallbackRef((e: React.MouseEvent<HTMLDivElement>, block:EditorBlock) => {
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
            bodyRef.current.addEventListener('scroll', scroll);
            dragData.current = {
                startX: e.clientX,
                startY: e.clientY,
                moveX: e.clientX,
                moveY: e.clientY,
                shiftKey: e.shiftKey,
                body: {
                    startScrollTop: bodyRef.current.scrollTop,
                    moveScrollTop: bodyRef.current.scrollTop   
                },
                startTop: block.top,
                startLeft: block.left,
                startPositions: focusData.focus.map(({top, left}) => ({top, left})),
                dragging: false,
                markLines: (() => {
                    const x: {left: number, showLeft: number}[] = [];
                    const y: {top: number, showTop: number}[] = [];

                    const {unfocus} = focusData;
                    unfocus.forEach(b => {
                        y.push({top: b.top - block.height, showTop: b.top})   // 底部对顶部
                        y.push({top: b.top ,showTop: b.top})   //顶部对顶部
                        y.push({top: b.top + b.height / 2 - block.height / 2, showTop: b.top + b.height / 2})  //中间对中间
                        y.push({top: b.top + b.height - block.height, showTop: b.top + b.height})   // 底部对底部
                        y.push({top: b.top + b.height, showTop: b.top + b.height})   //顶部对底部
                        
                        x.push({left: b.left - block.width, showLeft: b.left})   // 底部对顶部
                        x.push({left: b.left ,showLeft: b.left})   //顶部对顶部
                        x.push({left: b.left + b.width / 2 - block.width / 2, showLeft: b.left + b.width / 2})  //中间对中间
                        x.push({left: b.left + b.width - block.width, showLeft: b.left + b.width})   // 底部对底部
                        x.push({left: b.left + b.width, showLeft: b.left + b.width})   //顶部对底部
                    })

                    return {
                        x,
                        y
                    }
                })()
            }
        })

        const mouseMove = useCallbackRef((e:MouseEvent) => {
            dragData.current.shiftKey = e.button === 2
            dragData.current.moveY = e.clientY;
            dragData.current.moveX = e.clientX;
            handleMove();
        })

        const scroll = useCallbackRef((e: Event) => {
            const {body} = dragData.current;
            body.moveScrollTop = (e.target as HTMLDivElement).scrollTop;
            handleMove()
        })

        const mouseUp = useCallbackRef((e:MouseEvent) => {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
            bodyRef.current.removeEventListener('scroll', scroll);
            setMark({x: null, y: null})
            if(dragData.current.dragging) {
                dragend.emit();
            }
        })

        return {
            mouseDown,
            mark
        }
    })()

    const resizeDragger = (() => {
        const dragData = useRef({
            block: {} as EditorBlock,
            startX: 0,
            startY: 0,
            direction: {
                horizontal: BlockResizeDirection.start,
                vertical: BlockResizeDirection.start,
            },
            startBlock: {
                top: 0,
                left: 0,
                height: 0,
                width: 0,
            },
            dragging: false
        })

        const mouseDown = useCallbackRef((e: React.MouseEvent<HTMLDivElement>, direction: {horizontal: BlockResizeDirection, vertical: BlockResizeDirection}, block: EditorBlock) => {
            e.stopPropagation();
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
            dragData.current = {
                block,
                startX: e.clientX,
                startY: e.clientY,
                direction: direction,
                startBlock: {
                    ...deepcopy(block)
                },
                dragging: false
            }
        });
        const mouseMove = useCallbackRef((e: MouseEvent) => {
            if(!dragData.current.dragging) {
                dragData.current.dragging = true;
                dragstart.emit()
            }
            let {clientX, clientY} = e;
            const {startX, startY, startBlock, block, direction} = dragData.current;

            if(direction.horizontal == BlockResizeDirection.center) {
                clientX = startX;
            }

            if(direction.vertical == BlockResizeDirection.center) {
                clientY = startY;
            }

            let diffX = clientX - startX;
            let diffY = clientY - startY;

            if(direction.horizontal == BlockResizeDirection.start) {
                diffX = -diffX;
                block.left = startBlock.left - diffX
            }
            if(direction.vertical == BlockResizeDirection.start) {
                diffY = -diffY;
                block.top = startBlock.top - diffY;
            }

            block.width = startBlock.width + diffX;
            block.height = startBlock.height + diffY;
            block.hasResize = true;

            methods.updateBlocks(props.value.blocks);
        });
        const mouseUp = useCallbackRef((e: MouseEvent) => {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
            if(dragData.current.dragging) {
                dragend.emit();
            }
        });

        return {
            mouseDown
        }
    })()

    const commander = useVisualCommand({
        focusData,
        value: props.value,
        updateValue: methods.updateValue,
        updateBlocks: methods.updateBlocks,
        dragstart,
        dragend
    });

    const buttons: {
        label: string | (() => string),
        icon: string | (() => string),
        tip?: string | (() => string),
        handler: () => void
    }[] = [
        {label: "撤销", icon: "icon-chexiao", handler: commander.undo},
        {label: "重做", icon: "icon-zhongzuo", handler: commander.redo},
        {label: () => !preview ? '预览' : '编辑', icon: () => !preview ? "icon-chakan" : "icon-bianji", handler: () => {
            if(!preview) {
                methods.clearFocus();
            }
            setPreview(!preview)
        }},
        {label: "导入", icon: "icon--daoru", handler: async () => {
            const text = await $$dialog.textarea('', {title: '请输入导入JSON数据'});
            try {
                const data = JSON.parse(text || '');
                commander.updateValue(data);
            }catch(e) {
                console.log(e);
                notification.open({
                    message: '导入失败',
                    description: '导入的数据格式不正常，请检查'
                })
            }
        }},
        {label: "导出", icon: "icon--daochu", handler: () => {
            $$dialog.textarea(JSON.stringify(props.value), {editReadonly: true, title: '导出的JSON数据'})
        }},
        {label: "置顶", icon: "icon-control-top", handler: commander.placeTop},
        {label: "置底", icon: "icon-control-bottom", handler: commander.placeBottom},
        {label: "删除", icon: "icon-shanchu", handler: commander.delete},
        {label: "清空", icon: "icon-huanyuan", handler: commander.clear},
        {label: "关闭", icon: "icon-guanbi", handler: () => {}}
    ]

    const handler = {
        onContextMenuBlock: (e: React.MouseEvent<HTMLElement>, block: EditorBlock) => {
            e.preventDefault();
            e.stopPropagation();
            $$dropdown({
                refrence: e.nativeEvent,
                render: () => <>
                    <DropdownItem icon="icon-control-top" onClick={commander.placeTop}>置顶节点</DropdownItem>
                    <DropdownItem icon="icon-control-bottom" onClick={commander.placeBottom}>置底节点</DropdownItem>
                    <DropdownItem icon="icon-shanchu" onClick={commander.delete}>删除节点</DropdownItem>
                    <DropdownItem icon="icon-chakan" onClick={() => methods.showBlockData(block)}>查看数据</DropdownItem>
                    <DropdownItem icon="icon--daoru" onClick={() => methods.importBlockData(block)}>导入数据</DropdownItem>
                </>
            })
        }
    }

    return (
        <div className={classes}>
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
            <div className="react-visual-editor-head">
                {buttons.map((btn, index) => {
                    const icon = typeof btn.icon == 'function' ? btn.icon() : btn.icon;
                    const label = typeof btn.label == 'function' ? btn.label() : btn.label;
                    return (
                        <div className="react-visual-editor-head-btn" key={index} onClick={btn.handler}>
                            <i className={`iconfont ${icon}`}></i>
                            <span>{label}</span>
                        </div>
                    )
                })}
            </div>
            <EditorOperator value={props.value} selectBlock={selectBlock} updateValue={commander.updateValue} updateBlock={commander.updateBlock}/>
            <div className="react-visual-editor-body" ref={bodyRef}>
                <div className="react-visual-editor-container" style={containerStyles} ref={containerRef} onMouseDown={focusHandler.container}>
                    {props.value.blocks.map((block, index) => (
                        <Block 
                            key={index} 
                            block={block} 
                            config={props.config} 
                            onMouseDown={e => focusHandler.block(e, block, index)}
                            onContextMenu={e => handler.onContextMenuBlock(e, block)}
                        >
                            {
                                block.focus && 
                                !!props.config.componentMap[block.componentKey] &&
                                !!props.config.componentMap[block.componentKey].resize &&
                                (!!props.config.componentMap[block.componentKey].resize?.width || !!props.config.componentMap[block.componentKey].resize?.height) &&
                                <BlockResize component={props.config.componentMap[block.componentKey]} onMouseDown={(e, horizontal) => resizeDragger.mouseDown(e, horizontal, block)}></BlockResize>
                            }
                        </Block>
                    ))}
                    {blockDragger.mark.x!=null && <div className="react-visual-editor-mark-x" style={{left: `${blockDragger.mark.x}px`}}></div>}
                    {blockDragger.mark.y!=null && <div className="react-visual-editor-mark-y" style={{top: `${blockDragger.mark.y}px`}}></div>}
                </div>
            </div>
        </div>
    )
}

export default ReactVisualEditor;