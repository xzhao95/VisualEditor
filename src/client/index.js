import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import Store from '../store/clientStore';
import routers from '../Router'

const App = () => {
    return (
        <Provider store={Store}>
            <BrowserRouter>
                <div>
                    {routers.map(router => (
                        <Route {...router}/>
                    ))}
                </div>
            </BrowserRouter>
        </Provider>   
    )
}

ReactDom.hydrate(<App/>, document.getElementById('root'))