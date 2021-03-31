import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { NavLink } from 'reactstrap';

class NaviLink extends React.Component {
  render() {

    return (
      <li>
        <NavLink tag={Link} className="text-dark" {...this.props}>
          {this.props.children}
        </NavLink>
      </li>
    );
  }
}

NaviLink.contextTypes = {
  router: PropTypes.object
};

export default NaviLink;