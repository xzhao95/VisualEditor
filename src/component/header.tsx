import React from 'react'
import { Link } from 'react-router-dom'

const Header = (props: any) => {
    return (
        <div>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            {props.children}
        </div>
    )
}

export default Header;