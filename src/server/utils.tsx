import React from 'react'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
import { matchPath, Route, RouteProps, StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import getStore from '../store/serverStore'
import routers, { RouteConfig } from '../Router'
import { Request, Response } from 'express'
import { Store } from 'redux'

const serverRender = (req:Request, store:Store, context:any):String => {
    const template:String = fs.readFileSync(process.cwd() + '/public/static/index.html', "utf8")
    // const vendorCss = fs.readFileSync(process.cwd() + '/public/static/css/vendors.css', 'utf8')
    const content = renderToString((
        <Provider store={store}>
            <StaticRouter location={req.path} context={context}>
                <div>
                    {routers.map(router => (
                        <Route {...router}/>
                    ))}
                </div>
            </StaticRouter>
        </Provider>
    ))
    const cssStr = context.css.length ? context.css.join("\n") : ""
    // 注入数据
    const initialState = `<script>
        window.context = {
            INITIAL_STATE: ${JSON.stringify(store.getState())}
        }
    </script>`
    
    return template.replace("<!--app-->", content)
        .replace('<!--server-render-css-->', cssStr)
        .replace("<!--initial-state-->", initialState);
}

export const render = (req:Request, res:Response) => {
    const context = {css: []}
    const store = getStore();
    const matchRoutes:Array<RouteConfig> = [];
    const promises:any = [];
    routers.some((route:RouteConfig) => {
        matchPath(req.path, route) ? matchRoutes.push(route) : ''
    })
    
    matchRoutes.forEach(item => {
        if(item.loadData) {
            const promise = new Promise((resolve, reject) => {
                item.loadData && item.loadData(store).then(resolve).catch(resolve)
            })
            promises.push(promise)
        }
        
    })
    Promise.all(promises).then(() => {
        res.send(serverRender(req, store, context))
    })
}