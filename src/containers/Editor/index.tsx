import React, { useState } from "react";
import { visualConfig } from "../../utils/config";
import withStyles from "../../utils/withStyle";
import { EditorValue } from "./utils";
import ReactVisualEditor from './editor'
import style from './editor.less'
import './editor.less'

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
                    adjustPosition: false
                },
                {
                    componentKey: 'button',
                    top: 200,
                    left: 200,
                    adjustPosition: false
                },
                {
                    componentKey: 'input',
                    top: 300,
                    left: 300,
                    adjustPosition: false
                }
            ]
        }
        return val; 
    });

    return (
        <div className="app-home">
            <ReactVisualEditor config={visualConfig} value={editorValue} onChange={setEditorValue}></ReactVisualEditor>
        </div>
    )
}

export default withStyles(container, style)