import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import Header from '../component/header'
import { Pipeline } from './Pipeline/Pipeline'

// function Counter() {
//     const pipeline:Pipeline = {
//         stages: [
//             {
//                 title: "编译",
//                 jobs: [
//                     {
//                         name: "编译",
//                         status: 'success',
//                         time: 61000
//                     }
//                 ]
//             },
//             {
//                 title: "部署",
//                 jobs: [
//                     {
//                         name: "部署",
//                         status: 'success',
//                         time: 61000
//                     }
//                 ]
//             },
//             {
//                 title: "代码扫描和检查",
//                 jobs: [
//                     {
//                         name: "STC",
//                         status: 'success',
//                         time: 61000
//                     },
//                     {
//                         name: "PMD",
//                         status: 'success',
//                         time: 61000
//                     },
//                     {
//                         name: "PMD2",
//                         status: 'success',
//                         time: 61000
//                     }
//                 ]
//             },
//             {
//                 title: "集成测试",
//                 jobs: [
//                     {
//                         name: "集成测试",
//                         status: 'fail',
//                         time: 61000
//                     },
//                     {
//                         name: "单元测试",
//                         status: 'fail',
//                         time: 61000
//                     },
//                 ]
//             },
//         ]
//     }
//     return <Pipeline pipeline={pipeline}/>;
// }

// function usePrevious(value:number) {
//     const ref:React.MutableRefObject<number | undefined> = useRef();
//     useEffect(() => {
//         console.log(value)
//         ref.current = value;
//     });
//     console.log(ref.current)
//     return ref.current;
// }

let Child = memo((props:{onClick: () => void}) => {
    useEffect(() => console.log('children update~~'));

    return (<div>123</div>)
});

let app = () => {
    const [count, setCount] = useState(0);

    // function func() {
    //     console.log('click');
    // }
    const func = useCallback(() => {
        console.log('click');
    }, [])

    function handleCount() {
        setCount(val => val+1)
    }

    return (
        <div>
            <h2>{count}</h2>
            <Child onClick={func}></Child>
            <button onClick={handleCount}>update</button>

        </div>
    )
}
export default app