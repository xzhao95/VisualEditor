import { EditorProps } from "./Props";

/**
 * 容器内每个元素的数据类型
 */
export interface EditorBlock {
    componentKey: string,
    top: number,
    left: number,
    width: number,
    height: number,
    adjustPosition: boolean,    // block元素是否需要调整位置
    focus: boolean,             // 当前是否选中
    zindex: number,
    hasResize: boolean         // 是否调整过大小
    props?: Record<string, any>,
    model?: Record<string, string>
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
    render: (data: {
        block: EditorBlock,
        size: {heght?: string, width?: string}, 
        props: Record<string, any>, 
        model:  Record<string, {value: any, onChange: (val:any) => void}>
    }) => JSX.Element,
    resize?: {
        height?: boolean,
        width?: boolean
    },
    props?: {[k: string]: EditorProps},
    model?: {[k: string]: string}
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
        width: 0,
        height: 0,
        componentKey: component.key,
        adjustPosition: true,
        focus: false,
        zindex: 0,
        hasResize: false,
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
    function registryComponent<_,
        Props extends {[k: string]: EditorProps},
        Model extends {[k: string]: string},
        __
    >(key: string, option: {
        name: string,
        preview: () => JSX.Element,
        render: (data: {
            block: EditorBlock,
            size: {heght?: string, width?: string}, 
            props: Record<string, any>, 
            model: Record<string, {value: any, onChange: (val:any) => void}>
        }) => JSX.Element,
        resize?: {
            height?: boolean,
            width?: boolean
        }
        props?: Props,
        model?: Model
    }) {
        if(componentMap[key]) {
            const index = componentArray.indexOf(componentMap[key]);
            componentArray.splice(index, 1);
        }
        const newComponent = {
            key,
            ...option
        }
        componentArray.push(newComponent as any);
        componentMap[key] = newComponent as any;
    }
    return {
        componentMap,
        componentArray,
        registryComponent
    }
}

export type EditorConfig = ReturnType<typeof createEditorConfig>