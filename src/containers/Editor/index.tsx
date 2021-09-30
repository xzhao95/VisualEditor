import React, { useState } from "react";
import { visualConfig } from "../../utils/config";
import withStyles from "../../utils/withStyle";
import { EditorValue } from "./Utils";
import ReactVisualEditor from './EditorPanel'
import style from './EditorPanel.less'
import './EditorPanel.less'
import { notification } from "antd";

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
                    zindex: 0,
                    hasResize: false
                },
                {
                    componentKey: 'button',
                    top: 200,
                    left: 200,
                    width: 102,
                    height: 32,
                    adjustPosition: false,
                    focus: true,
                    zindex: 0,
                    hasResize: false
                },
                {
                    componentKey: 'input',
                    top: 300,
                    left: 300,
                    width: 171,
                    height: 32,
                    adjustPosition: false,
                    focus: true,
                    zindex: 0,
                    hasResize: false
                }
            ]
        }
        return val; 
    });

    const [formData, setFormData] = useState({
        username: 'zyt',
        age: '18',
        maxLevel: 100,
        minLevel: 50
    })

    const customProps = {
        buttonComponent: {
            onClick: () => {
                notification.open({
                    message: 'click custom'
                })
            }
        }
    }

    return (
        <div className="app-home">
            <ReactVisualEditor 
                config={visualConfig} 
                value={editorValue} 
                formData={formData}
                customProps={customProps}
                onFormDataChange={setFormData}
                onChange={setEditorValue}
            >
                {{
                    buttonComponent: formData.username.length < 5 ? () => <button /> : undefined
                }}
            </ReactVisualEditor>
        </div>
    )
}

export default withStyles(container, style)