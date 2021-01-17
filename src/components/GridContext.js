import React, { Component, createContext } from "react";
import axios from 'axios';
import api from './../api';
import { v4 as uuidv4 } from 'uuid';

function move(array, oldIndex, newIndex) {
  if (newIndex >= array.length) {
    newIndex = array.length - 1;
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  return array;
}

function moveElement(array, index, offset) {
  const newIndex = index + offset;

  return move(array, index, newIndex);
}


const GridContext = createContext({ items: [] });

export class GridProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      moveItem: this.moveItem,
      getItems: this.getItems,
      deleteItem: this.deleteItem,
      page: 1,
    };
  }
  
  componentDidMount() {
    this.getItems();
  }

  componentDidUpdate(prevProps) {
    console.log(this.state.items.length);
    if (this.props.tag !== prevProps.tag) {
      this.setItems([]);
      this.setState({
        page: 1
      })
      this.getItems();
    }
  }

  render() {
    return (
      <GridContext.Provider value={this.state}>
        {this.props.children}
      </GridContext.Provider>
    );
  }

  setItems = items => this.setState({ items });

  deleteItem = id => {
    const newSetOfImages = this.state.items.filter(image => image.id != id);
    this.setItems(newSetOfImages);
    api.analytics.logAction('delete', 'User deleted an image', `Image ID: ${id}`);
  }

  moveItem = (sourceId, destinationId) => {
    const sourceIndex = this.state.items.findIndex(
      item => item.id === sourceId
    );
    const destinationIndex = this.state.items.findIndex(
      item => item.id === destinationId
    );

    if (sourceId === -1 || destinationId === -1) {
      return;
    }

    const offset = destinationIndex - sourceIndex;

    this.setState(state => ({
      items: moveElement(state.items, sourceIndex, offset)
    }));
  };

  getItems = () => {
    if (this.state.page > 1) { 
      api.analytics.logAction('scroll', 'User scrolled');
    }
    const { tag } = this.props;
    const perPage = 20;
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${perPage}&format=json&nojsoncallback=1&page=${this.state.page}`;
    const baseUrl = 'https://api.flickr.com/';
    return axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    }).then(res => res.data).then(res => {
      if (res &&
        res.photos &&
        res.photos.photo &&
        res.photos.photo.length > 0
        ) {
        this.setState({
          page: this.state.page + 1
        });
        let newRawItems = res.photos.photo;
        let newItems = this.state.items;
        
        for (let i = 0; i < newRawItems.length; i++) {
          let currentRawItem = newRawItems[i];
          if (newItems.filter(item => item.id === currentRawItem.id).length > 0) {
            console.log("found duplicate!");
            continue;
          } else {
            newItems.push(currentRawItem);
          }
        }

        this.setItems(newItems);
      }
    });
  }
}

export default GridContext;