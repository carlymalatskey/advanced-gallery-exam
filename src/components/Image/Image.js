import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faTrashAlt, faExpand } from '@fortawesome/free-solid-svg-icons';
import './Image.scss';
import ExpandModal from "./ExpandModal/ExpandModal.js";
import api from '../../api';
import { Draggable } from 'react-beautiful-dnd';

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
    });
    api.analytics.logAction('expand image', 'User expanded an image', `Image Id: ${this.props.dto.id}`);
  }

  rotateImage() {
    let newRotation = 90 + this.state.rotation;
    this.setState ({
      rotation: newRotation
    });
    api.analytics.logAction('rotate', 'User rotated an image', `Image Id: ${this.props.dto.id}`);
  }

  handleCloseModal = () => {
    this.setState({
      showExpandModal: false
    })
  }

  render() {

    return (
      <Draggable
        key={this.props.dto.id}
        draggableId={this.props.dto.id}
        index={this.props.index}>
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="image-root"
                    style={{
                      backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
                      width: this.state.size + 'px',
                      height: this.state.size + 'px',
                      transform: `rotate(${this.state.rotation}deg)`
                    }}>
                  <div>
                      <FontAwesomeIcon icon={faSyncAlt} className="image-icon" name="sync-alt" title="rotate" onClick={() => this.rotateImage()}/>
                      <FontAwesomeIcon icon={faTrashAlt} className="image-icon" name="trash-alt" title="delete" onClick={() => this.deleteImage()}/>
                      <FontAwesomeIcon icon={faExpand} className="image-icon" name="expand" title="expand" onClick={() => this.expandImage()}/>
                  </div>
                <ExpandModal showModal={this.state.showExpandModal} image={this.urlFromDto(this.props.dto)} closeModal={() => this.handleCloseModal()}></ExpandModal>
            </div>
          )}
      </Draggable>   
    );
  }
}

export default Image;
