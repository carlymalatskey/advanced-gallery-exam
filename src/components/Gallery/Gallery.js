import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import InfiniteScroll from 'react-infinite-scroller';
import api from '../../api';

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

  getImages = (page) => {
    if (page > 0) { //therefore they scrolled!
      api.analytics.logAction('scroll', 'User scrolled');
    }
    const { tag } = this.props;
    const perPage = 50;
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${perPage}&format=json&nojsoncallback=1&page=${page}`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
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
    })
  }

  componentDidMount() {
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  handleDelete(imageId) {
    const newSetOfImages = this.state.images.filter(image => image.id != imageId);
    this.setState({
      images:newSetOfImages
    });
  }

  render() {
    const { images } = this.state;
    return (
      <div className="gallery-root">
        <InfiniteScroll
          pageStart={0}
          loadMore={this.getImages}
          hasMore={true}
          loader={<div>Gently loading...</div>}
        >
          {images.map(dto => {
            return <Image
                      key={'image-' + dto.id} 
                      dto={dto} 
                      galleryWidth={this.state.galleryWidth}
                      handleDelete={(id) => this.handleDelete(id)}/>;
          })}
        </InfiniteScroll>
      </div>
    );
  }
}

export default Gallery;
