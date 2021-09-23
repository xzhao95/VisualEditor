import React from 'react'
import Header from '../component/header'
import { connect } from 'react-redux'
import axios from 'axios'
import { Dispatch, Store } from 'redux'
import { StoreState } from '../store/Store'
import style from './Editor/EditorPanel.less'
import withStyles from "isomorphic-style-loader/withStyles";
interface HomeProps {
    getList: () => void,
    list: any[]
}

interface HomeState {
    list: any[]
}

class Home extends React.Component<HomeProps>{
    componentDidMount() {
        this.props.getList()
    }

    render() {
        return <div className={style.testbg}>
            <Header></Header>
            { this.props.list ? 
            <div>
                {this.props.list.map(item => (
                    <div key={item}>{item}</div>
                ))}
            </div> : '' }
            <button onClick={() => {alert('click')}}>click</button>
        </div>
    }

    static loadData(store: any) {
        return store.dispatch(getData())
    }
}


const getData = () => {
    return (dispatch:Dispatch) => {
        return axios.get('http://localhost:3001/list').then(res => {
            const list = res.data;
            dispatch({type: 'CHANGE_LIST', list: list});
        })
    }
}

const mapStateToProps = (state:StoreState) => ({
    list: state.list
})
const mapDispatchToProps = (dispatch: any) => ({
    getList() {
        dispatch(getData())
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Home));