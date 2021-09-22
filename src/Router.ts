import ReactVisualEditor from './containers/Editor/Index';
import { RouteProps } from 'react-router-dom';
import Home from './containers/Home'
import Login from './containers/Login';
import DraggerDemo from './containers/DraggerDemo';

export interface RouteConfig extends RouteProps {
    loadData?: (store:any)=>Promise<number>,
}

export default [
    {
        path: '/home',
        component: Home,
        exact: true,
        loadData: Home.loadData,
        key: 'Home'
    },
    {
        path: '/login',
        component: Login,
        exact: true,
        key: 'Login'
    },
    {
        path: '/dragger-demo',
        component: DraggerDemo,
        exact: true,
        key: 'DraggerDemo'
    },
    {
        path: '/editor',
        component: ReactVisualEditor,
        exact: true,
        key: 'ReactVisualEditor'
    }
]

