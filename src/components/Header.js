import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class Header extends Component {
  render() {
    return (
      <div className="header">
        <div>
          <Link to="/">Map</Link>
          <Link to="/callicoon">Callicoon</Link>
          <Link to="/barryville">Barryville</Link>
          <Link to="/portjervis">Port Jervis</Link>
          <Link to="/montague">Montague, NJ</Link>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)