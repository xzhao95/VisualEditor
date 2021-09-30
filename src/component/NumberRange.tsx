import React, { useMemo, useState } from 'react';
import { Input } from "antd"
import './NumberRange.less'

export const NumberRange:React.FC<{
    width?: number | string,
    start?: string,
    end?: string,
    onStartChange?: (val?:string) => void,
    onEndChange?: (val?:string) => void,
}> = (props) => {
    const [start, setStart] = useState(props.start);
    const [end, setEnd] = useState(props.end);

    const handle = {
        onStartChange: (e:React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setStart(val);
            !!props.onStartChange && props.onStartChange(val);
        },
        onEndChange: (e:React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setEnd(val);
            !!props.onEndChange && props.onEndChange(val);
        }
    }

    const styles = useMemo(() => {
        let width = props.width;
        if(!width) {
            width = '225px'
        }
        if(typeof width === 'number') {
            width = `${width}px`
        }
        return {
            width
        }
    }, [props.width])

    return (
        <div className="number-range" style={styles}>
            <Input defaultValue={start} onChange={handle.onStartChange}></Input>-
            <Input defaultValue={end} onChange={handle.onEndChange}></Input>
        </ div>
    )
}