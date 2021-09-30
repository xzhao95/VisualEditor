import React from "react";
import {Button, Input, Select} from "antd"
import { createEditorConfig } from "../containers/Editor/Utils";
import { createColorProp, createSelectProp, createTableProp, createTextProps } from "../containers/Editor/Props";
import { NumberRange } from "../component/NumberRange";

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
    render: ({size, props, custom}) => <Button type={props.type || 'primary'} style={size} size={props.size} {...custom}>{props.label || '渲染按钮'}</Button>,
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
    render: ({size, model}) => <Input style={size} value={model.default.value} onChange={model.default.onChange}/>,
    resize: {
        width: true
    },
    model: {
        default: "绑定值"
    }
})

visualConfig.registryComponent('select', {
    name: '下拉框',
    preview: () => (
        <Select value={123} style={{width: '150px'}}>
            <Select.Option value={123}>泡芙</Select.Option>
        </Select>
    ),
    render: ({props, size, model}) => (
        <Select
            key={(props.options || []).map(({label, value}:{label:string, value: string}) => `${label}_${value}`).join('-')}
            style={{width: size.width || '150px'}}
            value={model.default.value}
            onChange={model.default.onChange}
        >
            {(props.options || []).map((opt:any, index:number) => (
                <Select.Option value={opt.value} key={index}>{opt.label}</Select.Option>
            ))}
        </Select>
    ),
    resize: {
        width: true
    },
    props: {
        options: createTableProp('下拉选项', 'label', [
            {label: '显示值', field: 'label'},
            {label: '绑定值', field: 'value'}
        ])
    },
    model: {
        default:  '绑定值'
    }
})

visualConfig.registryComponent('number-range', {
    name: '范围输入框',
    preview: () => (<div style={{textAlign: 'center'}}>
        <NumberRange width="200px"></NumberRange>
    </div>),
    render: ({size, props, model, block}) => (
        <NumberRange 
            key={(() => {
                const model = block.model || {}
                return  (model.start || '@@start' + (model.end || '@@end'))
            })()}
            width={size.width}
            {...{
                start: model.start.value,
                end: model.end.value,
                onStartChange: model.start.onChange,
                onEndChange: model.end.onChange
            }}
        ></NumberRange>
    ),
    resize: {
        width: true
    },
    model: {
        start: '开始绑定值',
        end: '结束绑定值'
    }
})