import { useCallback, useRef } from "react"
/**
 * 通过将函数挂到 ref 上，保证永远都是拿到最新状态的函数，往外暴露时使用 useCallback 包裹，保证函数引用不更新
 * @param fn 
 * @returns 
 */
export function useCallbackRef<FN extends ((...args: any[]) => any)>(fn: FN):FN {
    
    const fnRef = useRef(fn);
    fnRef.current=fn

    return useCallback(((...args: any[]) => fnRef.current(...args)) as FN, [])
}