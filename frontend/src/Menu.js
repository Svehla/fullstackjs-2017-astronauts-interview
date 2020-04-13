import React from 'react';
import { Link } from 'react-router-dom'

const Menu = () => (
  <div className="App-header" style={{color: '#fff',background: '#456'}}>
    <div  className="container">

      <nav style={{marginBottom: 0}} className="navbar">
        <div className="container-fluid">
          <div className="navbar-header" style={{height: '80px'}}>
            <Link style={{color: '#fff', fontSize: '30px'}} className="navbar-brand" to="/">
              <div style={{marginBottom: '10px'}}><large>TechFides Astronauts</large></div>
              <div style={{fontSize: '20px'}}>Lets Develop The Future</div>
            </Link>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link style={{color: '#fff'}} to="/createAstronaut"> Create </Link>
            </li>
            <li>
              <Link style={{color: '#fff'}} to="/allAstronauts"> All </Link>
            </li>
          </ul>
        </div>
      </nav>

    </div>
  </div>
)

export default Menu
