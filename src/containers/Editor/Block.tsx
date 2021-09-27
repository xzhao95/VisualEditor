import classNames from "classnames";
import React, { useEffect, useMemo, useRef } from "react";
import { useUpdate } from "../../hook/useUpdate";
import { EditorBlock, EditorConfig } from "./Utils";

export const Block:React.FC<{
    block: EditorBlock,
    config: EditorConfig,
    onMouseDown: (e:React.MouseEvent<HTMLDivElement>)=>void,
    onContextMenu: (e:React.MouseEvent<HTMLElement>) => void
}> = (props) => {
    const elRef = useRef({} as HTMLDivElement)
    const {forceUpdate} = useUpdate();

    const styles = useMemo(() => {
        return {
            top: `${props.block.top}px`,
            left: `${props.block.left}px`,
            opacity: props.block.adjustPosition? '0' : '',
            zIndex: props.block.zindex
        }
    }, [props.block.top, props.block.left, props.block.zindex, props.block.adjustPosition])

    const classes = useMemo(() => {
        return classNames([
            'react-visual-editor-block',
            {
                'react-visual-editor-block-focus': props.block.focus,
            }
        ])
    }, [props.block.focus])

    const component = props.config.componentMap[props.block.componentKey];
    let render:any;

    if(!!component) {
        render = component.render({
            size: props.block.hasResize ? (() => {
                let styles = {
                    width: undefined as undefined | string,
                    height: undefined as undefined | string
                }
                !!component.resize?.width && (styles.width = `${props.block.width}px`);
                !!component.resize?.height && (styles.height = `${props.block.height}px`);

                return styles;
            })() : {},
            props: props.block.props || {}
        });
    }

    
    useEffect(() => {
        if(props.block.adjustPosition) {
            const {top, left} = props.block;
            const {height, width} = elRef.current.getBoundingClientRect();

            props.block.adjustPosition = false;
            props.block.top = top - height / 2;
            props.block.left = left - width / 2;
            props.block.width = elRef.current.offsetWidth;
            props.block.height = elRef.current. offsetHeight;
            forceUpdate();
        }
    }, [])

    return (
        <div 
            className={classes} 
            style={styles} 
            ref={elRef} 
            onMouseDown={props.onMouseDown}
            onContextMenu={props.onContextMenu}
        >
            {render}
            {props.children}
        </div>
    )
}