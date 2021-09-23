import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useCallbackRef } from '../../hook/useCallbackRef';
import "./$$dropdown.less"

interface DropdownOption {
    refrence: HTMLElement | {x: number, y: number} | MouseEvent,
    render: () => JSX.Element | JSX.Element[] | React.ReactFragment
}

const DropdownContext = React.createContext<{onClick: () => void | undefined}>({onClick: () => {}});

const Dropdown:React.FC<{
    option: DropdownOption,
    onRef: (ins:{show:(opt:DropdownOption) => void}) => void
}> = (props) => {
    const elRef = useRef({} as HTMLDivElement)
    const [option, setOption] = useState(props.option);
    const [showFlag, setShowFlag] = useState(false);

    const styles = useMemo(() => {
        let top:number, left:number;
        if('addEventListener' in option.refrence) {
            const {top: y, left: x} = option.refrence.getBoundingClientRect();
            top = y;
            left = x;
        }else if('target' in option.refrence) {
            const {clientX, clientY} = option.refrence;
            top = clientY;
            left = clientX;
        }else {
            top = option.refrence.y;
            left = option.refrence.x
        }
        return {
            display: showFlag ? 'inline-block' : 'none',
            top: `${top}px`,
            left: `${left}px`
        }
    }, [showFlag])

    const methods = {
        show: (opt: DropdownOption) => {
            setOption(opt);
            setShowFlag(true)
        },
        close: () => {
            setShowFlag(false)
        }
    }

    const handler = {
        onClickBody: useCallbackRef((e: MouseEvent) => {
            if(elRef.current.contains(e.target as Node)) {

            }else {
                methods.close();
            }
        }),
        onClickDropdownItem: useCallbackRef(() => {
            methods.close();
        })
    }

    props.onRef(methods);

    useEffect(() => {
        document.body.addEventListener('click', handler.onClickBody);
        return () => {
            document.body.removeEventListener('click', handler.onClickBody)
        }
    })

    return (
        <DropdownContext.Provider value={{onClick: handler.onClickDropdownItem}}>
            <div className="dropdown-service" style={styles} ref={elRef}>
                {option.render()}
            </div>
        </DropdownContext.Provider>
    )
}

export const DropdownItem:React.FC<{
    icon?: string,
    onClick?: () => void
}> = (props) => {
    const dropdown = useContext(DropdownContext);
    const handler = {
        onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            !!dropdown.onClick && dropdown.onClick();
            !!props.onClick && props.onClick()
        }
    }
    return (
        <div className="dropdown-item" onClick={handler.onClick}>
            {!!props.icon && <i className={`iconfont ${props.icon}`}/>}
            {props.children}
        </div>
    )
}

export const $$dropdown = (() => {
    let ins: any;
    return (option?: DropdownOption) => {
        if(!ins) {
            const el = document.createElement('div');
            document.body.appendChild(el);
            ReactDOM.render(<Dropdown option={option!} onRef={val => ins = val}/>, el);
        }
        ins.show(option)
    }
})()

