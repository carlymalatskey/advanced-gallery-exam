import React from 'react';
import LogoText from "./../../assets/FlickrLogo.png";
import {
    BrowserRouter as Router,
    Link
  } from "react-router-dom";
import { Nav, Image, Button } from 'react-bootstrap';
import "./NavBar.scss";


class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
        <Router>
            <Nav className="nav-bar"> 
              <div className="left-header">
                <Image className="logo-image" src={LogoText} />
              </div>
              <div style={{display: "inline-flex"}}>
                <h4 className="name-nav-bar">Welcome {this.props.name}!</h4>
                <a href="https://www.flickr.com/" target="_blank" className="link-button">flickr.com</a>
              </div>
            </Nav>
        </Router>
        )
    }
}

export default NavBar; 