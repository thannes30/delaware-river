import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class Header extends Component {
  render() {
    return (
      <div className="header">
        <div>
          <Link to="/">Map</Link>
          <Link to="/haleeddy">Hale Eddy, NY</Link>
          <Link to="/callicoon">Callicoon, NY</Link>
          <Link to="/barryville">Barryville, NY</Link>
          <Link to="/portjervis">Port Jervis, NY</Link>
          <Link to="/montague">Montague, NJ</Link>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
