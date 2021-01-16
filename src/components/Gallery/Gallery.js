import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import InfiniteScroll from 'react-infinite-scroller';
import api from '../../api';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      dragId: 0,
      page: 1
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages = () => {
    if (this.state.page > 1) { //therefore they scrolled!
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
        let nextPage = this.state.page + 1;
        this.setState({
          page: nextPage,
          images: this.state.images.concat(res.photos.photo),
        });
      }
    });
  }

  componentDidMount() {
    if (this.props.tag) {
      this.getImages();
    }
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.tag !== prevProps.tag) {
      this.setState({
        page: 1,
        images: []
      })
    }
  }

  handleDelete(imageId) {
    const newSetOfImages = this.state.images.filter(image => image.id != imageId);
    this.setState({
      images:newSetOfImages
    });
  }
  
  onDragEnd = (result) => {
    const { destination, source } = result; 
    if(!destination) {
      return;
    }

    if(destination.droppableId === source.droppableId && destination.index === source.index) {
      return; 
    }

    const images = Object.assign([], this.state.images); 
    const droppedImage = this.state.images[source.index];
    
    images.splice(source.index, 1); // remove the image at the index of the source (the image that is being dragged)
    images.splice(destination.index, 0, droppedImage); // go to the destination index, don't remove an element, and add the droppedImage there
    this.setState({
      images
    })
  }

  shouldQuery = () => {
    return this.state.images.length > 0;
  }

  render() {
    const { images } = this.state;
    return (
      <div>
        {this.props.tag.length > 0 ? 
          <div>
            <DragDropContext onDragEnd={(result) => this.onDragEnd(result)}>
              <div className="gallery-root">
                <Droppable droppableId='droppable'>
                {(provided)=>(
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}>
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={this.getImages}
                      hasMore={() => this.shouldQuery()}
                      loader={<div>Gently loading...</div>}
                    >
                      {
                        this.state.images.map((dto, index) => {
                          return (
                            <Image 
                              key={index} 
                              dto={dto} 
                              index={index} 
                              galleryWidth={this.state.galleryWidth} 
                              handleDelete={(id) => this.handleDelete(id)}
                            />
                          )
                        })
                      }
                    </InfiniteScroll>
                    {provided.placeholder}
                  </div>
                  )}
                </Droppable>
              </div>
          </DragDropContext>
          </div>
          :
          <div>
            Write a tag!
          </div>
        }
      </div>
    );
  }
}

export default Gallery;
