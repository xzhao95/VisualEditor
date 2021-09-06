import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const reducer = (state = { name: 'ZYT' }, action) => {
    switch (action.type) {
        case 'CHANGE_LIST': 
            return Object.assign({}, state, {list: action.list});
        default: 
            return state;
    }
} 

const getStore = () => {
    return createStore(reducer, applyMiddleware(thunk))
}

export default getStore