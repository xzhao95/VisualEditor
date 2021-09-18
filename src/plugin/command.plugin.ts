import { useEffect } from 'react';
import { useCallback, useState, useRef } from 'react';
import { isBrowser } from '../utils/browser';
import { KeyboardCode } from './keyboardCode';

export interface CommandExecute {
    undo?: () => void,
    redo: () => void
}

export interface Command {
    name: string,
    keyboard: string | string[],
    execute: (...args: any[]) => CommandExecute,
    followQueue: boolean,
    init?: () => (()=>void | undefined)
}

export function useCommander() {
    const [state] = useState(() => ({
        current: -1,   // 当前命令队列中，最后执行的命令返回的CommandExecute对象
        queue: [] as CommandExecute[], //命令队列
        commandArray: [] as { current: Command } [],  // 预定义命令的数组
        commands: {} as Record<string, (...args: any[]) => void>, //通过command name执行 command动作的一个包装
        destoryList: [] as ((() => void) | undefined)[]  // 所有命令在组件销毁之前，需要执行的副作用的函数数组
    }));

    /**
     * 注册命令
     */
    const useRegistry = useCallback((command: Command) => {
        const commandRef = useRef(command);
        commandRef.current = command;

        useState(() => {
            if(state.commands[command.name]) {
                const existIndex = state.commandArray.findIndex(item => item.current.name === command.name);
                state.commandArray.splice(existIndex, 1);
            }

            state.commandArray.push(commandRef);
            state.commands[command.name] = (...args: any[]) => {
                const {redo, undo} = commandRef.current.execute(...args);
                redo();

                /* 如果命令执行后，不需要进入命令队列，则直接结束，比如撤销、重做命令 */
                if(commandRef.current.followQueue == false) {
                    return;
                }

                /* 否则，将命令队列中剩余的命令去除，保留current及其之前的命令 */
                let {queue, current} = state;
                if(queue.length > 0) {
                    queue = queue.slice(0, current + 1);
                    state.queue = queue;
                }
                queue.push({undo, redo});

                state.current = current + 1
            }
        })
    }, [])

    const [keyboardEvent] = useState(() => {
        const onkeydown = (e: KeyboardEvent) => {
            if(document.activeElement != document.body) {
                return;
            }
            const {keyCode, shiftKey, altKey, ctrlKey, metaKey } = e;
            let keyString: string[] = [];
            if(ctrlKey) keyString.push('ctrl')
            if(shiftKey) keyString.push('shift')
            if(altKey) keyString.push('alt')
            keyString.push(KeyboardCode[keyCode]);
            const keyName = keyString.join('+');

            if(!keyName) return
            state.commandArray.forEach(({current: {keyboard, name}}) => {
                if(!keyboard) {
                    return;
                }
                const keys = Array.isArray(keyboard) ? keyboard : [keyboard];
                if(keys.indexOf(keyName) >= 0) {
                    state.commands[name]();
                    e.stopPropagation();
                    e.preventDefault();
                }
            })
        }

        const init = () => {
            
            isBrowser && window.addEventListener('keydown', onkeydown);
            return () => {
                isBrowser && window.removeEventListener('keydown', onkeydown);
            }
        }
        return {init}
    })

    /**
     * 初始化所有command的init方法
     */
    const useInit = useCallback(() => {
        useState(() => {
            state.commandArray.forEach(command => !!command.current.init && state.destoryList.push(command.current.init()));
            state.destoryList.push(keyboardEvent.init())
        })

        /* 内置命令 */
        useRegistry({
            name: 'undo',
            keyboard: 'ctrl+z',
            followQueue: false,
            execute: () => {
                return {
                    redo: () => {
                        if(state.current == -1) {
                            return
                        }
                        const queueItem = state.queue[state.current];
                        if(!!queueItem) {
                            !!queueItem.undo && queueItem.undo();
                            state.current --
                        }
                    },
                }
            }
        });
        useRegistry({
            name: 'redo',
            keyboard: 'ctrl+shift+z',
            followQueue: false,
            execute: () => {
                return {
                    redo: () => {
                        const queueItem = state.queue[state.current+1];
                        if(!!queueItem) {
                            !!queueItem.redo && queueItem.redo();
                            state.current ++
                        }
                    },
                }
            }
        })
    }, [])

    useEffect(() => {
        return () => {
            state.destoryList.forEach(fn => !!fn && fn())
        }
    }, [])

    return {
        state,
        useRegistry,
        useInit
    }
}