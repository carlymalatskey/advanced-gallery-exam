import './AppHeader.scss';

import React from 'react';
import BackgroundImage from "./../../assets/background.jpg";
import { Image } from 'react-bootstrap';
import LogoDots from "./../../assets/flickrDots.svg";

class AppHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputTag: ''
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.tag !== prevProps.tag) {
            this.setState({
                inputTag: this.props.tag
            })
        }
    }

    handleSearchTagChange = (e) => {
        let newTag = e.target.value;
        if (this.typingTimeout) {
          clearTimeout(this.typingTimeout);
        }
        this.typingTimeout = setTimeout(() => {
          this.props.handleTagChange(this.state.inputTag);
        }, 300);
        this.setState({
            inputTag: newTag
        });
    }

    render() {
        return (
            <div className="app-header" style={{backgroundImage: `url(${BackgroundImage})`}}>
                <div className="app-title">Your Flickr Inspiration</div>
                <div style={{fontSize: "2.3vw", marginTop: "2vw"}}>Home to tens of billions of photos and 2 million groups.</div>
                <Image className="logo-dots" src={LogoDots}></Image>
                <div>
                    <div className="app-sub-tag">Find your collection of photos. Enter a tag and your pictures will appear below!</div>
                    <input className="app-input" onChange={event => this.handleSearchTagChange(event)} value={this.state.inputTag} placeholder={"Enter keyword"}/>
                </div>
            </div>
        );
    }
}

export default AppHeader;
