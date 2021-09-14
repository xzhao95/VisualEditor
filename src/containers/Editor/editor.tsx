import React from "react"
import withStyle from "../../utils/withStyle"
import style from './editor.less'
import './editor.less'
import { EditorConfig, EditorValue } from "./utils"

const ReactVisualEditor:React.FC<{
    value: EditorValue,
    onChange: (val: EditorValue) => void,
    config: EditorConfig
}> = (props) => {
    console.log(props);
    return (
        <div className="react-visual-editor">
            <div className="react-visual-editor-menu">
                {props.config.componentArray.map((component, index) => (
                    <div className="react-visual-editor-menu-item" key={index}>
                        {component.preview()}
                        <div className="react-visual-editor-menu-item-name">
                            {component.name}
                        </div>
                    </div>
                ))}
            </div>
            <div className="react-visual-editor-head">head</div>
            <div className="react-visual-editor-operator">operator</div>
            <div className="react-visual-editor-body">body</div>
        </div>
    )
}

export default ReactVisualEditor;