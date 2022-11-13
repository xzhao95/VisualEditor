declare module '*.less' {
    const classes: {readonly [key: string]: string};
    export default classes;
}
declare module 'isomorphic-style-loader/withStyles';
declare module 'isomorphic-style-loader/useStyles';
declare module 'isomorphic-style-loader/StyleContext'