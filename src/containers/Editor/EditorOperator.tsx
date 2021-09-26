import { Button, Form, Input, InputNumber } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import deepcopy from 'deepcopy';
import React, { useEffect, useState } from 'react';
import { EditorBlock, EditorValue } from './Utils';

const EditorOperator:React.FC<{
    selectBlock: EditorBlock | undefined,
    value: EditorValue,
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

    }

    const methods = {
        reset: () => {
            let data = {};
            if(!!props.selectBlock) {
                data = deepcopy(props.selectBlock);
            }else {
                data = deepcopy(props.value.container);
            }
            form.resetFields();
            form.setFieldsValue(data);
        },
        apply: () => {
            if(!!props.selectBlock) {
                props.updateBlock(editData, props.selectBlock);
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

export default EditorOperator;