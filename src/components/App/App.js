import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import Cookies from "universal-cookie";
import api from './../../api';
import { Form, Button } from 'react-bootstrap';
import { GridProvider } from "./../GridContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
        })
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
      <div className="app-root">
        {this.state.name ? 
          <div>
            <div>Hello {this.state.name} </div>
            <div className="app-header">
              <h2>Flickr Gallery</h2>
              <div>
                <p className="app-sub-tag">Find your collection of photos. Enter a tag and your pictures will appear below!</p>
                <input className="app-input" onChange={event => this.handleSearchTagChange(event)} value={this.state.tempTag} placeholder={"Enter keyword"}/>
              </div>
            </div>
            <DndProvider backend={HTML5Backend}>
              <GridProvider tag={this.state.tag}>
                <Gallery/>
              </GridProvider>
            </DndProvider>
          </div>
          :
          <div className="enter-name-form">
            <Form className="form-section">            
              <Form.Label>Enter your name to access your Flickr Gallery:</Form.Label>
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
        }
      </div>
    );
  }
}

export default App;
