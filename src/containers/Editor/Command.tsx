import deepcopy from "deepcopy";
import { useRef } from "react";
import { useCallbackRef } from "../../hook/useCallbackRef";
import { useCommander } from "../../plugin/command.plugin";
import { EditorBlock, EditorValue } from "./Utils";

export function useVisualCommand(
    {
        focusData,
        value,
        updateBlocks,
        dragstart,
        dragend
    }: {
        focusData: {
            focus: EditorBlock[],
            unfocus: EditorBlock[]
        },
        value: EditorValue,
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

    commander.useInit()
    return {
        delete: () => commander.state.commands.delete(),
        undo: () => commander.state.commands.undo(),
        redo: () => commander.state.commands.redo()
    }
}