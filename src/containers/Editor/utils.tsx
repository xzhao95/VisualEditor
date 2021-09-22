/**
 * 容器内每个元素的数据类型
 */
export interface EditorBlock {
    componentKey: string,
    top: number,
    left: number
    adjustPosition: boolean,
    focus: boolean,
    index: number
}
/**
 * 编辑器编辑的数据类型
 */
export interface EditorValue {
    container: {
        height: number,
        width: number,
    },
    blocks: EditorBlock[]
}
/**
 * 编辑器中预定义组件的类型
 */
export interface EditorComponent {
    key: string,
    name: string,
    preview: () => JSX.Element,
    render: () => JSX.Element
}

/**
 * 
 * @returns 
 */
export function createVisualBlock(
    {
        top,
        left,
        component
    }: {
        top: number,
        left: number,
        component: EditorComponent
    }
):EditorBlock {
    return {
        top,
        left,
        componentKey: component.key,
        adjustPosition: true,
        focus: false,
        index: 0
    }
}
/**
 * 创建一个编辑器预设配置信息对象
 * @returns 
 */
export function createEditorConfig() {
    // 用于在容器内渲染组件
    const componentMap: {[K:string]: EditorComponent} = {};
    // 用于menu内组件列表的渲染
    const componentArray:EditorComponent[] = [];

    /**
     * 注册组件
     * @param key 组件的key 
     */
    function registryComponent(key: string, option: Omit<EditorComponent, 'key'>) {
        if(componentMap[key]) {
            const index = componentArray.indexOf(componentMap[key]);
            componentArray.splice(index, 1);
        }
        const newComponent = {
            key,
            ...option
        }
        componentArray.push(newComponent);
        componentMap[key] = newComponent;
    }
    return {
        componentMap,
        componentArray,
        registryComponent
    }
}

export type EditorConfig = ReturnType<typeof createEditorConfig>