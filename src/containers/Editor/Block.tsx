import React, { useEffect, useMemo, useRef } from "react";
import { useUpdate } from "../../hook/useUpdate";
import { EditorBlock, EditorConfig } from "./utils";

export const Block:React.FC<{
    block: EditorBlock,
    config: EditorConfig
}> = (props) => {
    const elRef = useRef({} as HTMLDivElement)
    const {forceUpdate} = useUpdate();

    const styles = useMemo(() => {
        return {
            top: `${props.block.top}px`,
            left: `${props.block.left}px`,
            opacity: props.block.adjustPosition? '0' : ''
        }
    }, [props.block.top, props.block.left, props.block.adjustPosition])

    const component = props.config.componentMap[props.block.componentKey];
    let render:any;

    if(!!component) {
        render = component.render();
    }

    
    useEffect(() => {
        if(props.block.adjustPosition) {
            const {top, left} = props.block;
            const {height, width} = elRef.current.getBoundingClientRect();

            console.log(height, width)
            props.block.adjustPosition = false;
            props.block.top = top - height / 2;
            props.block.left = left - width / 2;
            forceUpdate();
        }
    }, [])

    return (
        <div className="react-visual-editor-block" style={styles} ref={elRef}>
            {render}
        </div>
    )
}