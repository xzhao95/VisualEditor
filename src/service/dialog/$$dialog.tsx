import React, { useEffect, useState } from 'react';
// import '$$dialog.less';
import ReactDOM from 'react-dom';
import Modal from 'antd/lib/modal/Modal';
import { Button, Input } from 'antd';
import { defer } from '../../utils/defer';

interface DialogServiceOption {
    title?: string,
    message?: string,
    editType?: 'input' | 'textarea',
    editReadonly?: boolean,
    editValue?: string,
    onConfirm?: (editValue: string) => void,
    onCancel?: () => void,
    confirmButton?: boolean,
    cancelButton?: boolean
}

const DialogService = (() => {
    let ins: any;
    return (option: DialogServiceOption) => {
        if(!ins) {
            const el = document.createElement('div');
            document.body.appendChild(el);

            const Service:React.FC<{
                option: DialogServiceOption, 
                onRef: (ins: {show: (opt: DialogServiceOption) => void}) => void
            }> = (props) => {
                const [option, setOption] = useState(props.option)
                const [showFlag, setShowFlag] = useState(false);
                const [editValue, setEditValue] = useState('');

                const handler = {
                    onCancel: () => {
                        !!option.onCancel && option.onCancel();
                        methods.close();
                    },
                    onConfirm: () => {
                        !!option.onConfirm && option.onConfirm(editValue);
                        methods.close();
                    }
                }

                const inputProps = {
                    value: editValue,
                    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setEditValue(e.target.value);
                    }
                }

                const methods = {
                    show: (opt: DialogServiceOption) => {
                        setOption(opt);
                        setEditValue(opt.editValue || '');
                        setShowFlag(true)
                    },
                    close: () => {
                        setShowFlag(false)
                    }
                }

                props.onRef(methods);

                useEffect(() => {
                    methods.show(props.option)
                }, [])
                return (
                    <Modal 
                        
                        maskClosable={true}
                        closable={true}
                        title={option.title}
                        visible={showFlag}
                        onCancel={handler.onCancel}
                        footer={(option.confirmButton || option.cancelButton) ? (
                            <>
                                {option.cancelButton && <Button onClick={handler.onCancel}>取消</Button>}
                                {option.confirmButton && <Button type="primary" onClick={handler.onConfirm}>确认</Button>}
                            </>
                        ): null}
                    >
                        {option.message}
                        {option.editType === 'input' && (
                            <Input {...inputProps}/>
                        )}
                        {option.editType === 'textarea' && (
                            <Input.TextArea {...inputProps} rows={15}/>
                        )}
                    </Modal>
                )
            }
            ReactDOM.render(<Service option={option} onRef={val => ins = val}/>, el)
        }else {
            ins.show(option);
        }
    }
})()

export const $$dialog = {
    textarea: (editValue?: string, opt?: Omit<DialogServiceOption, 'editValue'>):Promise<string | undefined> => {
        const dfd = defer<string>();
        const option:DialogServiceOption = {
            editType: 'textarea',
            editValue,
            ...(opt || {}),
            cancelButton: true,
            confirmButton: true,
            onConfirm: (editValue) => {
                dfd.resolve(editValue)
            }
        }
        DialogService(option)
        return dfd.promise;

    }
}
