import React from "react";
import {Button, Input} from "antd"
import { createEditorConfig } from "../containers/Editor/Utils";

export const visualConfig = createEditorConfig();

visualConfig.registryComponent('text', {
    name: '文本',
    preview: () => <span>预览文本</span>,
    render: () => <span>渲染文本</span>,
})

visualConfig.registryComponent('button', {
    name: '按钮',
    preview: () => <Button type="primary">预览的按钮</Button>,
    render: ({size}) => <Button type="primary" style={size}>渲染的按钮</Button>,
    resize: {
        width: true,
        height: true
    }
})

visualConfig.registryComponent('input', {
    name: '输入框',
    preview: () => <Input />,
    render: ({size}) => <Input  style={size}/>,
    resize: {
        width: true
    }
})