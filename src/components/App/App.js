import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import Cookies from "universal-cookie";
import api from './../../api';
import { Card, Image } from 'react-bootstrap';
import LogoDots from "./../../assets/flickrDots.svg";
import sportsTag from "./../../assets/sportsTag.jpeg";
import natureTag from "./../../assets/natureTag.jpg";
import artsTag from "./../../assets/artsTag.jpeg";
import beachTag from "./../../assets/beachTag.jpg";
import BackgroundImage from "./../../assets/background.jpg";
import 'react-toastify/dist/ReactToastify.css';
import { GridProvider } from "./../GridContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import NavBar from "./../NavBar/NavBar";
import LoginForm from "./../LoginForm/LoginForm";

const cookies = new Cookies();

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.typingTimeout = 0;
    this.state = {
      tempTag: '',
      tag: '',
      name: undefined
    };
  }

  componentDidMount() {
    let name = cookies.get('name');
    if (name) {
      this.setState({
        name
      })
    }
  }

  async handleSubmitName(inputName) {
    let nameRequest = await api.user.setName(inputName);
    if (nameRequest.data.status == "success") {
        this.setState({
          name: cookies.get('name')
        });
    } else {
        alert(`Error: ${nameRequest.data.message}`);
    }
  }

  handleSearchTagChange = (e) => {
    let newTag = e.target.value;
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = setTimeout(() => {
      this.setState({
        tag: newTag
      }),
      api.analytics.logAction('tag', 'User entered new tag', `Tag: ${this.state.tag}`)
    }, 300);
    this.setState({
      tempTag: newTag
    });
  }

  isLoggedIn = () => {
    return (this.state.name !== undefined);
  }

  render() {
    return (
      <div className="app-root" id="app-root">
        <NavBar name={this.state.name}></NavBar>
        {this.isLoggedIn() ? 
          <div>
            <div className="app-header" style={{backgroundImage: `url(${BackgroundImage})`}}>
              <div className="app-title">Your Flickr Inspiration</div>
              <div style={{fontSize: "2.3vw", marginTop: "2vw"}}>Home to tens of billions of photos and 2 million groups.</div>
              <Image className="logo-dots" src={LogoDots}></Image>
              <div>
                <div className="app-sub-tag">Find your collection of photos. Enter a tag and your pictures will appear below!</div>
                <input className="app-input" onChange={event => this.handleSearchTagChange(event)} value={this.state.tempTag} placeholder={"Enter keyword"}/>
              </div>
            </div>
            {this.state.tag.length <= 0 ? 
              <div className="trending-section">
                <div>Explore Trending Tags</div>
                <div className="cards">
                  <Card className="card" onClick={() => this.setState({tempTag: "nature", tag: "nature"})} style={{backgroundImage: `url(${natureTag})`, backgroundSize: "29vw 19vw"}}>
                    <Card.Body>
                        <Card.Title className="card-title">Nature</Card.Title>
                    </Card.Body>
                  </Card>
                  <Card className="card" onClick={() => this.setState({tempTag: "sports", tag: "sports"})}
                  style={{backgroundImage: `url(${sportsTag})`, backgroundSize: "25vw 21vw"}}>
                    <Card.Body>
                      <Card.Title>Sports</Card.Title>
                    </Card.Body>
                  </Card>
                  <Card className="card" onClick={() => this.setState({tempTag: "arts", tag: "arts"})}
                  style={{backgroundImage: `url(${artsTag})`, backgroundSize: "24vw 19vw"}}>
                    <Card.Body>
                      <Card.Title>Arts</Card.Title>
                    </Card.Body>
                  </Card>
                  <Card className="card" onClick={() => this.setState({tempTag: "beach", tag: "beach"})}style={{backgroundImage: `url(${beachTag})`, backgroundSize: "22vw 19vw"}}>
                    <Card.Body>
                      <Card.Title>Beach</Card.Title>
                    </Card.Body>
                  </Card>
                </div>
              </div>
              :
              <div></div>
            }
            <DndProvider backend={HTML5Backend}>
              <GridProvider tag={this.state.tag}>
                <Gallery/>
              </GridProvider>
            </DndProvider>
          </div>
          :
          <LoginForm handleSubmitName={(name) => this.handleSubmitName(name)}/>
        }
      </div>
    );
  }
}

export default App;
