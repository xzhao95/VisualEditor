import { Button, Input, Table, Tag } from 'antd';
import React, { useState } from 'react';
import { EditorTableProps } from '../containers/Editor/Props';
import { PlusOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom'
import Modal from 'antd/lib/modal/Modal';
import { defer } from '../utils/defer';
import deepcopy from 'deepcopy';

export const TabelPropEditor:React.FC<{
    value?: any[],
    config: EditorTableProps,
    onChange?: (val?: any[]) => void
}> = (props) => {

    let render: any;

    const methods = {
        openEditor: async () => {
            const newVal = await TablePropEditService({
                config: props.config,
                value: props.value || []
            });

            props.onChange && props.onChange(newVal)
        }
    }

    if(!props.value || props.value.length === 0) {
        render = (
            <Button onClick={methods.openEditor}>
                <PlusOutlined></PlusOutlined>
                添加
            </Button>
        )
    }else {
        render = (props.value || []).map((item, index) => {
            return <Tag key={index}  onClick={methods.openEditor}>
                {item[props.config.showField]}
            </Tag>
        })
    }

    return (
        <div>
            {render}
        </div>
    )
}

interface TablePropEditServiceOption {
    config: EditorTableProps,
    value: any[],
    onConfirm?: (val?: any[]) => void
}

const nextKey = (() => {
    let start = Date.now();
    return () => start ++;
})()

const TablePropEditModle:React.FC<{option: TablePropEditServiceOption, onRef: (ins: {show: (opt: TablePropEditServiceOption) => void}) => void}> = (props) => {
    const [showFlag, setShowFlag] = useState(false);
    const [option, setOption] = useState(props.option);
    const [editData, $setEditData] = useState([] as any[]);

    const setEditData = (val: any) => {
        $setEditData((val.map((d:any) => {
            !d.key && (d.key = nextKey())
            return d;
        })))
    }
    

    const methods = {
        show: (opt: TablePropEditServiceOption) => {
            setOption(opt);
            setShowFlag(true);
            setEditData(deepcopy(opt.value || []))
        },
        close:() => {
            setShowFlag(false)
        },
        save:() => {
            !!option.onConfirm && option.onConfirm(editData);
            methods.close()
        },
        add: () => {
            setEditData([
                ...editData,
                {}
            ])
        },
        reset: () => {
            setEditData(deepcopy(option.value || []))
        }
    }

    props.onRef(methods)

    return (
        <Modal 
            visible={showFlag}
            onCancel={methods.close}
            footer={[
                <Button key="cancel" onClick={methods.close}>取消</Button>,
                <Button key="save" type="primary" onClick={methods.save}>保存</Button>
            ]}
        >
            <div className="table-prop-editor-dialog-buttons">
                <Button type="primary" style={{marginLeft: '8px'}} onClick={methods.add}>添加</Button>
                <Button>重置</Button>
            </div>
            <div className="table-prop-editor-dialog-table">
                <Table dataSource={editData}>
                    {option.config.column.map((col, index) => 
                        <Table.Column
                            title={col.label}
                            dataIndex={col.field}
                            key={col.field}
                            render={(_1, row:any, index) => <Input
                                value={row[col.field]}
                                onChange={e => {
                                    row = {...row, [col.field]: e.target.value}
                                    editData[index] = row;
                                    setEditData([...editData])
                                }}
                            ></Input>}
                        ></Table.Column>
                    )}
                    <Table.Column
                        title="操作"
                        key="operator"
                        render={(_1, row:any, index) => <>
                            <Button>删除</Button>
                        </>}
                    ></Table.Column>
                </Table>
            </div>
        </Modal>
    )
}

const TablePropEditService = (() => {
    let ins: any;

    return (option: Omit<TablePropEditServiceOption, 'onConfirm'>):Promise<undefined | any[]> => {
        const dfd = defer<undefined | any[]>();
        option = {
            ...option,
            onConfirm: dfd.resolve
        } as TablePropEditServiceOption;
        if(!ins) {
            const el = document.createElement('div');
            document.body.appendChild(el);
            ReactDOM.render(<TablePropEditModle option={option} onRef={i => ins = i}/>, el);
        }
        ins.show(option);
        return dfd.promise;
    }
})()