import React from "react";
import {Button, Input} from "antd"
import { createEditorConfig } from "../containers/Editor/Utils";
import { createColorProp, createSelectProp, createTextProps } from "../containers/Editor/Props";

export const visualConfig = createEditorConfig();

visualConfig.registryComponent('text', {
    name: '文本',
    preview: () => <span>预览文本</span>,
    render: ({props}) => <span style={{color: props.color ? props.color.hex: null}}>{props.text || '渲染文本'}</span>,
    props: {
        text: createTextProps('显示文本'),
        color: createColorProp('文本颜色')
    }
})

visualConfig.registryComponent('button', {
    name: '按钮',
    preview: () => <Button type="primary">预览的按钮</Button>,
    render: ({size, props}) => <Button type={props.type || 'primary'} style={size} size={props.size}>{props.label || '渲染按钮'}</Button>,
    resize: {
        width: true,
        height: true
    },
    props: {
        label: createTextProps('按钮文本'),
        type: createSelectProp('按钮类型', [
            {label: 'primary', value: 'primary'},
            {label: 'ghost', value: 'ghost'},
            {label: 'dashed', value: 'dashed'},
            {label: 'link', value: 'link'},
            {label: 'text', value: 'text'},
            {label: 'default', value: 'default'}
        ]),
        size: createSelectProp('按钮大小', [
            {label: '大', value: 'large'},
            {label: '中', value: 'middle'},
            {label: '小', value: 'small'}
        ])
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