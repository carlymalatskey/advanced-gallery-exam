import React, { Component, createContext } from "react";
import axios from 'axios';
import api from './../api';

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
      loading: false,
      prevY: 0
    };
  }
  
  componentDidMount() {
    this.getItems();

    var options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    };
    
    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options 
    );
    this.observer.observe(this.loadingRef);
  }

  handleObserver(entities, observer) {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      const lastPhoto = this.state.items[this.state.items.length - 1];
      const curPage = lastPhoto.id;
      this.getItems(curPage);
      this.setState({ page: curPage });
    }
    this.setState({ prevY: y });
  }


  componentDidUpdate(prevProps) {
    if (this.props.tag !== prevProps.tag) {
      this.setItems([]);
      this.setState({
        page: 1, 
        prevY: 0
      })
      this.getItems();
    }
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
    this.setState({ loading: true });
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
        
        // logic to check for duplicates in the dataset 
        for (let i = 0; i < newRawItems.length; i++) {
          let currentRawItem = newRawItems[i];
          if (newItems.filter(item => item.id === currentRawItem.id).length > 0) {
            continue;
          } else {
            newItems.push(currentRawItem);
          }
        }

        this.setItems(newItems);
      }
    });
  }
  render() {
    return (
      <GridContext.Provider value={this.state}>
        {this.props.children}
        <div
          ref={loadingRef => (this.loadingRef = loadingRef)} />
      </GridContext.Provider>
    );
  }
}

export default GridContext;