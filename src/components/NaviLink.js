import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';

class NaviLink extends React.Component {
  render() {
    var isActive = this.context.router === this.props.to;
    var className = isActive ? 'active' : '';

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