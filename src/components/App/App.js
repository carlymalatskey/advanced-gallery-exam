import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import Cookies from "universal-cookie";
import api from './../../api';
import { Form, Button, Card, Image } from 'react-bootstrap';
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
import NavBar from "./../NavBar/NavBar"

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
      name: '',
      inputName: ''
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

  handleNameInputChange(e) {
    this.setState({
      inputName: e.target.value
    })
  }

  async handleSubmitName() {
    let nameRequest = await api.user.setName(this.state.inputName);
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

  render() {
    return (
      <div className="app-root" id="app-root">
        {this.state.name ? 
          <div>
            <NavBar name={this.state.name} tag={this.state.tag}></NavBar>
            <div className="app-header" style={{backgroundImage: `url(${BackgroundImage})`}}>
              <h2 className="app-title">Your Flickr Inspiration</h2>
              <h4 style={{fontSize: "2.3vw", marginTop: "2vw"}}>Home to tens of billions of photos and 2 million groups.</h4>
              <Image className="logo-dots" src={LogoDots}></Image>
              <div>
                <p className="app-sub-tag">Find your collection of photos. Enter a tag and your pictures will appear below!</p>
                <input className="app-input" onChange={event => this.handleSearchTagChange(event)} value={this.state.tempTag} placeholder={"Enter keyword"}/>
              </div>
            </div>
            {this.state.tag.length <= 0 ? 
              <div className="trending-section">
                <h2>Explore Trending Tags</h2>
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
          <div>
            <NavBar></NavBar>
            <div className="enter-name-form">
              <Form>            
                <Form.Label style={{fontSize: "2.8vw"}}>Enter your name to access your Flickr Gallery:</Form.Label>
                <Form.Group>
                  <Form.Control type="text" 
                                placeholder="Enter name" 
                                className="name-input" 
                                onChange={(e) => this.handleNameInputChange(e)} 
                                value={this.state.inputName}/>
                </Form.Group>
              </Form>
              <Button type="submit" className="submit-button" onClick={() => this.handleSubmitName()}>Submit</Button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
