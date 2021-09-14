import React from 'react';

interface NewComponentProps {
    staticContext: any
}
type AnyComponent<P = any> =
| (new (props: P) => React.Component)
| ((props: P & { children?: React.ReactNode }) => React.ReactElement<any> | null);

export default function withStyles<T extends NewComponentProps>(DecoratedComponent: AnyComponent, styles:any) {
    return class NewComponent extends React.Component<T> {
        componentDidMount() {
            if(this.props.staticContext) {
                const css = styles._getCss().replace('static/img', './img')
                this.props.staticContext.css.push(css)
            }
        }
        render() {
            return <DecoratedComponent {...this.props as T} />
        }
    }
}