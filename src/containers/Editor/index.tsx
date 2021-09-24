import React, { useState } from "react";
import { visualConfig } from "../../utils/config";
import withStyles from "../../utils/withStyle";
import { EditorValue } from "./Utils";
import ReactVisualEditor from './EditorPanel'
import style from './EditorPanel.less'
import './EditorPanel.less'

const container = () => {
    const [editorValue, setEditorValue] = useState(() => {
        const val:EditorValue = {
            container: {
                height: 500,
                width: 700
            },
            blocks: [
                {
                    componentKey: 'text',
                    top: 100,
                    left: 100,
                    width: 56,
                    height: 22,
                    adjustPosition: false,
                    focus: false,
                    index: 0
                },
                {
                    componentKey: 'button',
                    top: 200,
                    left: 200,
                    width: 102,
                    height: 32,
                    adjustPosition: false,
                    focus: true,
                    index: 0
                },
                {
                    componentKey: 'input',
                    top: 300,
                    left: 300,
                    width: 171,
                    height: 32,
                    adjustPosition: false,
                    focus: true,
                    index: 0
                }
            ]
        }
        return val; 
    });
    // console.log(style)
    // debugger

    return (
        <div className="app-home">
            <ReactVisualEditor config={visualConfig} value={editorValue} onChange={setEditorValue}></ReactVisualEditor>
        </div>
    )
}

export default withStyles(container, style)