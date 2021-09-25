import React from "react"
import { EditorComponent } from "../containers/Editor/Utils";
export enum BlockResizeDirection {
    start = 'start',
    center = "center",
    end = "end"
}
export const BlockResize:React.FC<{
    component: EditorComponent,
    onMouseDown: (e:React.MouseEvent<HTMLDivElement>, direction: {horizontal: BlockResizeDirection, vertical: BlockResizeDirection}) => void
}> = (props) => {
    const render = [];
    if(props.component.resize?.width) {
        render.push(<div className="editor-block-resize editor-block-resize-right" key="right" onMouseDown={e => props.onMouseDown(e, {horizontal: BlockResizeDirection.end, vertical: BlockResizeDirection.center})}></div>)
        render.push(<div className="editor-block-resize editor-block-resize-left" key="left" onMouseDown={e => props.onMouseDown(e, {horizontal: BlockResizeDirection.start, vertical: BlockResizeDirection.center})}></div>)
    }
    if(props.component.resize?.height) {
        render.push(<div className="editor-block-resize editor-block-resize-top" key="top" onMouseDown={e => props.onMouseDown(e, {horizontal: BlockResizeDirection.center, vertical: BlockResizeDirection.start})}></div>);
        render.push(<div className="editor-block-resize editor-block-resize-bottom" key="bottom" onMouseDown={e => props.onMouseDown(e, {horizontal: BlockResizeDirection.center, vertical: BlockResizeDirection.end})}></div>);
    }
    if(props.component.resize?.width && props.component.resize?.height) {
        render.push(<div className="editor-block-resize editor-block-resize-top-left" key="top-left"  onMouseDown={e => props.onMouseDown(e, {horizontal: BlockResizeDirection.start, vertical: BlockResizeDirection.start})}></div>);
        render.push(<div className="editor-block-resize editor-block-resize-top-right" key="top-right" onMouseDown={e => props.onMouseDown(e, {horizontal: BlockResizeDirection.end, vertical: BlockResizeDirection.start})}></div>);
        render.push(<div className="editor-block-resize editor-block-resize-bottom-right" key="bottom-right" onMouseDown={e => props.onMouseDown(e, {horizontal: BlockResizeDirection.end, vertical: BlockResizeDirection.end})}></div>);
        render.push(<div className="editor-block-resize editor-block-resize-bottom-left" key="bottom-left" onMouseDown={e => props.onMouseDown(e, {horizontal: BlockResizeDirection.start, vertical: BlockResizeDirection.end})}></div>);
    }
    return <>{render}</>
}