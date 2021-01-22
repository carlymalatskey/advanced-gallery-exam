import React, { Component, createContext } from "react";
import axios from 'axios';
import api from './../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
      totalItems: 0,
      page: 1,
      loading: false,
      prevY: 0
    };
  }
  
  componentDidMount() {
    toast.configure(); 
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

  handleObserver = (entities, observer) => {
    if (this.state.items.length > 0) {
      const y = entities[0].boundingClientRect.y;
      if (this.state.prevY > y) {
        this.getItems();
      }
      this.setState({ prevY: y });
    }
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
    toast("Picture deleted!");
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

  getItems = async () => {
    this.setState({ loading: true });
    if (this.state.page > 1) { 
      api.analytics.logAction('scroll', 'User scrolled');
    }
    const { tag } = this.props;
    let res = await api.search.getItems(tag, this.state.page);
    if (res.data && res.data.photos && res.data.photos.photo && res.data.photos.photo.length > 0) {
      this.setState({
        page: this.state.page + 1,
        totalItems: this.state.page == 1 ? parseInt(res.data.photos.total) : this.state.totalItems 
      });
      let newRawItems = res.data.photos.photo;
      let newItems = this.state.items;
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
    };

  render() {
    return (
      <div>
        <GridContext.Provider value={this.state}>
          {this.props.children}
          {this.state.loading && this.props.tag.length > 0 &&
            <div>
              <div>Loading Images...</div>
              {this.state.items.length > 0 ? 
                <div>Displaying [{this.state.items.length}/{this.state.totalItems}]</div>
                :
                <div></div>
              }
            </div>
          }
          <div
            ref={loadingRef => (this.loadingRef = loadingRef)} />
        </GridContext.Provider>
        <ToastContainer />
      </div>
    );
  }
}

export default GridContext;