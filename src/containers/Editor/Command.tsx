import deepcopy from "deepcopy";
import { useRef } from "react";
import { useCallbackRef } from "../../hook/useCallbackRef";
import { useCommander } from "../../plugin/command.plugin";
import { EditorBlock, EditorValue } from "./Utils";

export function useVisualCommand(
    {
        focusData,
        value,
        updateValue,
        updateBlocks,
        dragstart,
        dragend
    }: {
        focusData: {
            focus: EditorBlock[],
            unfocus: EditorBlock[]
        },
        value: EditorValue,
        updateValue: (value: EditorValue) => void,
        updateBlocks: (blocks: EditorBlock[]) => void,
        dragstart: {on: (cb: () => void) => void, off: (cb: () => void) => void},
        dragend: {on: (cb: () => void) => void, off: (cb: () => void) => void},
    }
) {
    const commander = useCommander()

    commander.useRegistry({
        name: 'delete',
        keyboard: [
            'delete',
            'ctrl+d',
            'backspace'
        ],
        followQueue: true,
        execute() {
            const before = deepcopy(value.blocks);
            const after = deepcopy(focusData.unfocus)
            return {
                redo: () => {
                    updateBlocks(deepcopy(after))
                },
                undo: () => {
                    updateBlocks(deepcopy(before))
                }
            }
        }
    });

    /**
     * 拖拽命令
     * - 从菜单栏拖拽组件到容器
     * - 在容器中拖拽组件调整位置
     * - 拖拽调整组件的宽度和高度
     */
    (() => {
        const dragData = useRef({before: null as null | EditorBlock[]});
        const handler = {
            dragstart: useCallbackRef(() => dragData.current.before = deepcopy(value.blocks)),
            dragend: useCallbackRef(() => commander.state.commands.drag())
        }
        
        commander.useRegistry({
            name: 'drag',
            keyboard: '',
            followQueue: true,
            init() {
                dragData.current = {before: null}
                dragstart.on(handler.dragstart);
                dragend.on(handler.dragend);
                return() => {
                    dragstart.off(handler.dragstart);
                    dragend.off(handler.dragend)
                }
            },
            execute() {
                let before = deepcopy(dragData.current.before!);
                let after = deepcopy(value.blocks)
                return {
                    redo: () => {
                        updateBlocks(deepcopy(after))
                    },
                    undo: () => {
                        updateBlocks(deepcopy(before))
                    }
                }
            }
        })
    })()

    commander.useRegistry({
        name: 'selectAll',
        keyboard: 'ctrl+a',
        followQueue: false,
        execute: () => {
            return {
                redo: () => {
                    value.blocks.forEach(block => block.focus = true);
                    updateBlocks(value.blocks);
                }
            }
        }
    })

    /**
     * 置顶命令
     */

    commander.useRegistry({
        name: 'placeTop',
        keyboard: 'ctrl+up',
        followQueue: true,
        execute: () => {
            const before = deepcopy(value.blocks);
            const after = deepcopy((() => {
                const {focus, unfocus} = focusData;
                const maxUnfocusIndex = unfocus.reduce((prev, cur) => Math.max(prev, cur.index), -Infinity);
                const minFocusIndex = focus.reduce((prev, cur) => Math.min(prev, cur.index), Infinity);

                let diff = maxUnfocusIndex - minFocusIndex;
                if(diff >= 0) {
                    diff ++;
                    focus.forEach(block => block.index = block.index + diff)
                }
                return value.blocks
            })())
            return {
                redo: () => {
                    updateBlocks(deepcopy(after))
                },
                undo: () =>{
                    updateBlocks(deepcopy(before))
                }
            }
        }
    })

    /**
     * 置底命令
     */

     commander.useRegistry({
        name: 'placeBottom',
        keyboard: 'ctrl+down',
        followQueue: true,
        execute: () => {
            const before = deepcopy(value.blocks);
            const after = deepcopy((() => {
                const {focus, unfocus} = focusData;
                const minUnfocusIndex = unfocus.reduce((prev, cur) => Math.min(prev, cur.index), Infinity);
                const maxFocusIndex = focus.reduce((prev, cur) => Math.max(prev, cur.index), -Infinity);
                const minFocusIndex = focus.reduce((prev, cur) => Math.min(prev, cur.index), Infinity);

                let diff = maxFocusIndex - minUnfocusIndex;
                if(diff >= 0) {
                    diff ++;
                    focus.forEach(block => block.index = block.index - diff);
                    if(minFocusIndex - diff < 0) {
                        diff = diff - minFocusIndex;
                        value.blocks.forEach(block => block.index = block.index + diff)
                    }
                }
                return value.blocks
            })())
            return {
                redo: () => {
                    updateBlocks(deepcopy(after))
                },
                undo: () =>{
                    updateBlocks(deepcopy(before))
                }
            }
        }
    })
    /**
     * 清空
     */
    commander.useRegistry({
        name: 'clear',
        followQueue: true,
        execute: () => {
            const before = deepcopy(value.blocks);
            const after = deepcopy([]);
            return {
                redo: () => {
                    updateBlocks(deepcopy(after))
                },
                undo: () => {
                    updateBlocks(deepcopy(before))
                }
            }
        }
    })

    /**
     * 更新value
     */
    commander.useRegistry({
        name: 'updateValue',
        followQueue: true,
        execute: (newVal) => {
            const before = deepcopy(value);
            const after = deepcopy(newVal) 
            return {
                redo: () => {
                    updateValue(after);
                },
                undo: () => {
                    updateValue(before)
                }
            }
        }
    })

    /**
     * 更新block
     */
    commander.useRegistry({
        name: 'updateBlock',
        followQueue: true,
        execute: (newBlock, oldBlock) => {
            const before = deepcopy(value);
            value.blocks.splice(value.blocks.indexOf(oldBlock), 1, newBlock);
            const after = deepcopy(value);
            return {
                redo: () => {
                    updateValue(deepcopy(after))
                },
                undo: () => {
                    updateValue(deepcopy(before))
                }
            }
        }
    })

    commander.useInit()
    return {
        delete: () => commander.state.commands.delete(),
        undo: () => commander.state.commands.undo(),
        redo: () => commander.state.commands.redo(),
        placeTop: () => commander.state.commands.placeTop(),
        placeBottom: () => commander.state.commands.placeBottom(),
        clear: () => commander.state.commands.clear(),
        updateValue: (newVal:string) => commander.state.commands.updateValue(newVal),
        updateBlock: (newBlock: EditorBlock, oldBlock: EditorBlock) => commander.state.commands.updateBlock(newBlock, oldBlock),
    }
}