export enum PropsType {
    text = 'text',
    select = 'select',
    color = 'color',
    table = 'table'
}

export type EditorProps = EditorTextProp | EditorColorProps | EditorSelectProps | EditorTableProps;

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

/*----------------------------------table-------------------------------------*/
export interface EditorTableProps {
    name: string,
    showField: string,
    column: {
        label: string,
        field: string
    }[],
    type: PropsType.table
}

export function createTableProp(name: string, showField: string, column: {label: string,field: string}[]): EditorProps {
    return {
        name,
        showField,
        column,
        type: PropsType.table
    }
}