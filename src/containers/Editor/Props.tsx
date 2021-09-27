export enum PropsType {
    text = 'text',
    select = 'select',
    color = 'color'
}

export type EditorProps = EditorTextProp | EditorColorProps | EditorSelectProps;

/*----------------------------------text-------------------------------------*/
interface EditorTextProp {
    name: string,
    type: PropsType.text
}

export function createTextProps(name:string):EditorProps {
    return {
        name,
        type: PropsType.text
    }
}

/*----------------------------------color-------------------------------------*/
interface EditorColorProps {
    name: string,
    type: PropsType.color
}

export function createColorProp(name: string): EditorProps {
    return {
        name,
        type: PropsType.color
    }
}

/*----------------------------------select-------------------------------------*/
interface EditorSelectProps {
    name: string,
    options: {
        label: string,
        value: string
    }[],
    type: PropsType.select
}

export function createSelectProp(name: string, options: {label: string,value: string}[]): EditorProps {
    return {
        name,
        options,
        type: PropsType.select
    }
}