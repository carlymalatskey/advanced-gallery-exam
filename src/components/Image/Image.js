import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import ExpandModal from "./ExpandModal/ExpandModal.js";

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      rotation: 0,
      showExpandModal: false
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  deleteImage() {
    const { id } = this.props.dto;
    this.props.handleDelete(id);
  }

  expandImage() {
    this.setState({
      showExpandModal: true
    })
  }

  rotateImage() {
    let newRotation = 90 + this.state.rotation;
    this.setState ({
      rotation: newRotation
    })
  }

  handleCloseModal = () => {
    this.setState({
      showExpandModal: false
    })
  }

  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: `rotate(${this.state.rotation}deg)`
        }}
        >
        <div>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={() => this.rotateImage()}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={() => this.deleteImage()}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={() => this.expandImage()}/>
        </div>
        <ExpandModal showModal={this.state.showExpandModal} image={this.urlFromDto(this.props.dto)} closeModal={() => this.handleCloseModal()}></ExpandModal>
      </div>
    );
  }
}

export default Image;
