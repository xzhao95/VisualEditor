import React, { useEffect, useRef, useState } from 'react'
import Header from '../component/header'

function Counter() {
    const [count, setCount] = useState(0);
    const calculation = count + 100;
    const prevCalculation = usePrevious(calculation);
    setTimeout(() => {setCount(200)}, 1000)
    return <h1>Now: {count}, before: {prevCalculation}</h1>;
}

function usePrevious(value:number) {
    const ref:React.MutableRefObject<number | undefined> = useRef();
    useEffect(() => {
        console.log(value)
        ref.current = value;
    });
    console.log(ref.current)
    return ref.current;
}

export default Counter