import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import Cookies from "universal-cookie";
import api from './../../api';
import { Card } from 'react-bootstrap';
import sportsTag from "./../../assets/sportsTag.jpeg";
import natureTag from "./../../assets/natureTag.jpg";
import artsTag from "./../../assets/artsTag.jpeg";
import beachTag from "./../../assets/beachTag.jpg";
import 'react-toastify/dist/ReactToastify.css';
import { GridProvider } from "./../GridContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import NavBar from "./../NavBar/NavBar";
import LoginForm from "./../LoginForm/LoginForm";
import AppHeader from '../AppHeader/AppHeader';
import TrendingTags from '../TrendingTags/TrendingTags';

const cookies = new Cookies();

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.typingTimeout = 0;
    this.state = {
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

  handleTagChange = (tag) => {
    api.analytics.logAction('tag', 'User entered new tag', `Tag: ${this.state.tag}`)
    this.setState({
      tag
    });
  }

  isLoggedIn = () => {
    return (this.state.name !== undefined);
  }

  shouldShowTrendingTags = () => {
    return (this.state.tag.length === 0);
  }

  render() {
    return (
      <div className="app-root" id="app-root">
        <NavBar name={this.state.name}></NavBar>
        {this.isLoggedIn() ? 
          <div>
            <AppHeader handleTagChange={(tag) => this.handleTagChange(tag)} tag={this.state.tag}/>
            {this.shouldShowTrendingTags() ? 
              <TrendingTags changeTag={(tag) => this.handleTagChange(tag)}/>
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
