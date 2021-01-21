import React from 'react';
import LogoText from "./../../assets/FlickrLogo.png";
import { Nav, Image } from 'react-bootstrap';
import BackgroundImage from "./../../assets/background.jpg";
import "./NavBar.scss";


class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
          <Nav className="nav-bar panel fixed-top navbar-expand-sm navbar-light bg-white"> 
            <div className="left-header">
              <Image className="logo-image" src={LogoText} />
            </div>
            <div style={{display: "inline-flex"}}>
              {this.props.tag.length > 0 ?
                <a className="link-button search" href="App.js#app-root">Back To Top</a>            
                :
                <div></div> 
              }
              <h4 className="name-nav-bar">Welcome {this.props.name}!</h4>
              <a href="https://www.flickr.com/" target="_blank" className="link-button">Join the Flickr Community </a>
            </div>
          </Nav>
        )
    }
}

export default NavBar; 