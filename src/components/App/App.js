import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import axios from "axios";
import Cookies from "universal-cookie";
import api from './../../api';

const cookies = new Cookies();

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art',
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

  render() {
    return (
      <div className="app-root">
        {this.state.name ? 
          <div>
            <div>Hello {this.state.name}</div>
            <div className="app-header">
              <h2>Flickr Gallery</h2>
              <input className="app-input" onChange={event => this.setState({tag: event.target.value})} value={this.state.tag}/>
            </div>
            <Gallery tag={this.state.tag}/>
          </div>
          :
          <div>
            <input type="text" placeholder="Enter your name" onChange={(e) => this.handleNameInputChange(e)} value={this.state.inputName}></input>
            <button type="submit" onClick={() => this.handleSubmitName()}>Submit</button>
          </div>
        }
      </div>
    );
  }
}

export default App;
