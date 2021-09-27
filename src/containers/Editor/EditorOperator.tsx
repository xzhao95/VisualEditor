import { Button, Form, Input, InputNumber, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import deepcopy from 'deepcopy';
import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color'
import { EditorProps, PropsType } from './Props';
import { EditorBlock, EditorConfig, EditorValue } from './Utils';

const EditorOperator:React.FC<{
    selectBlock: EditorBlock | undefined,
    value: EditorValue,
    config: EditorConfig,
    updateValue: (newVal: EditorValue) => void,
    updateBlock: (newBlock: EditorBlock, oldBlock: EditorBlock) => void
}> = (props) => {

    const [editData, setEditData] = useState({} as any);
    const [form] = useForm();
    const render:JSX.Element[] = []

    
    
    if(!props.selectBlock) {
        render.push((
            <Form.Item label="宽度" name="width" key="container-width">
                <InputNumber step={100} min={0} precision={0}></InputNumber>
            </Form.Item>
        ))
        render.push((
            <Form.Item label="高度" name="height" key="container-height">
                <InputNumber step={100} min={0} precision={0}></InputNumber>
            </Form.Item>
        ))
    }else { 
        const component = props.config.componentMap[props.selectBlock.componentKey];
        if(component) {
            render.push(
                ...Object.entries(component.props || {})
                    .map(([propName, propConfig]) => renderBlockOperator(propName, propConfig))
            )
        }
        
    }

    const methods = {
        reset: () => {
            let data = {};
            if(!!props.selectBlock) {
                data = deepcopy(props.selectBlock);
            }else {
                data = deepcopy(props.value.container);
            }
            setEditData(data)
            form.resetFields();
            form.setFieldsValue(data);
        },
        apply: () => {
            if(!!props.selectBlock) {
                props.updateBlock(deepcopy(editData), props.selectBlock);
            }else {
                props.updateValue({
                    ...props.value,
                    container: {
                        ...editData
                    }
                })
            }
        },
        onFormValueChange: (changeValues: any, values: any) => {
            setEditData({
                ...editData,
                ...values
            })
        }
    }

    useEffect(() => methods.reset(), [props.selectBlock])
    return (
        <div className="react-visual-editor-operator">
            <div className="react-visual-editor-operator-title">{!!props.selectBlock ? '编辑元素' : '编辑容器'}</div>
            <Form form={form} layout="vertical" onValuesChange={methods.onFormValueChange}>
                {render}
                <Form.Item key="operator">
                    <Button type="primary" onClick={methods.apply} style={{marginRight: '8px'}}>应用</Button>
                    <Button onClick={methods.reset}>重置</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

function renderBlockOperator(propName:string, propConfig:EditorProps) {
    switch(propConfig.type) {
        case PropsType.text:
            return (
                <Form.Item label={propConfig.name} name={['props', propName]} key={propName}>
                    <Input></Input>
                </Form.Item>
            )
        case PropsType.select:
            return (
                <Form.Item label={propConfig.name} name={['props', propName]} key={propName}>
                    <Select>
                        {propConfig.options.map((opt, index) => (
                            <Select.Option value={opt.value} key={index}>{opt.label}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            )
        case PropsType.color:
            return (
                <Form.Item label={propConfig.name} name={['props', propName]} key={propName} valuePropName="color">
                    <SketchPicker></SketchPicker>
                </Form.Item>
            )
        default: 
            return (<div>error</div>)
    }
    
}

export default EditorOperator;