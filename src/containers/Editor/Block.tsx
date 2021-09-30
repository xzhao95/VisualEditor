import classNames from "classnames";
import React, { useEffect, useMemo, useRef } from "react";
import { useUpdate } from "../../hook/useUpdate";
import { EditorBlock, EditorConfig } from "./Utils";

export const Block:React.FC<{
    block: EditorBlock,
    config: EditorConfig,
    formData: any,
    onFormDataChange: (val: any) => void
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
            block: props.block,
            size: props.block.hasResize ? (() => {
                let styles = {
                    width: undefined as undefined | string,
                    height: undefined as undefined | string
                }
                !!component.resize?.width && (styles.width = `${props.block.width}px`);
                !!component.resize?.height && (styles.height = `${props.block.height}px`);

                return styles;
            })() : {},
            props: props.block.props || {},
            model: Object.entries(component.model || {}).reduce((prev, item) => {
                const [modelProp, modelName] = item;
                const bindField = (props.block.model|| {})[modelProp];
                prev[modelProp] = {
                    value: !bindField ? null : props.formData[bindField],
                    onChange: (e) => {
                        if(!bindField) return;
                        let val:any;
                        if(!e) {
                            val = e;
                        }else {
                            if(typeof e === 'object' && 'target' in e) {
                                val = e.target.value
                            }else {
                                val = e
                            }
                        }
                        props.onFormDataChange({
                            ...props.formData,
                            [bindField]: val
                        });
                    }
                }
                return prev
            }, {} as Record<string, {value: any, onChange: (val:any) => void}>)
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