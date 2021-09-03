import React from 'react'
import Header from '../component/header'

const Home = () => {
    return <div>
        <Header></Header>
        <div>Home11</div>
        <button onClick={() => {alert('click')}}>click</button>
    </div>
}

export default Home;