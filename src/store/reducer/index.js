const rootReducer = (state = { name: 'ZYT' }, action) => {
    switch (action.type) {
        case 'CHANGE_LIST': 
            return Object.assign({}, state, {list: action.list});
        default: 
            return state;
    }
}

export default rootReducer