import deepcopy from "deepcopy";
import { useCommander } from "../../plugin/command.plugin";
import { EditorBlock, EditorValue } from "./Utils";

export function useVisualCommand(
    {
        focusData,
        value,
        updateBlocks
    }: {
        focusData: {
            focus: EditorBlock[],
            unfocus: EditorBlock[]
        },
        value: EditorValue,
        updateBlocks: (blocks: EditorBlock[]) => void
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
    })

    commander.useInit()
    return {
        delete: () => commander.state.commands.delete(),
        undo: () => commander.state.commands.undo(),
        redo: () => commander.state.commands.redo()
    }
}