import React from 'react'
import Header from '../component/header'
import { connect } from 'react-redux'
import axios from 'axios'

class Home extends React.Component{
    componentDidMount() {
        this.props.getList()
    }

    render() {
        return <div>
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
}

Home.loadData = (store) => {
    return store.dispatch(getData())
}

const getData = () => {
    return (dispatch) => {
        return axios.get('http://localhost:3001/list').then(res => {
            const list = res.data;
            dispatch({type: 'CHANGE_LIST', list: list});
        })
    }
}

const mapStateToProps = state => ({
    name: state.name, 
    list: state.list
})
const mapDispatchToProps = dispatch => ({
    getList() {
        dispatch(getData())
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(Home);