import React, { useState } from "react";
import { visualConfig } from "../../utils/config";
import withStyles from "../../utils/withStyle";
import { EditorValue } from "./utils";
import ReactVisualEditor from './editor'
import style from './editor.less'
import './editor.less'

const container = () => {
    const [editorValue, setEditorValue] = useState({
        container: {
            height: 700,
            width: 1000
        }
    } as EditorValue);

    return (
        <div className="app-home">
            <ReactVisualEditor config={visualConfig} value={editorValue} onChange={setEditorValue}></ReactVisualEditor>
        </div>
    )
}

export default withStyles(container, style)