import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faTrashAlt, faExpand } from '@fortawesome/free-solid-svg-icons';
import './Image.scss';
import ExpandModal from "./ExpandModal/ExpandModal.js";
import api from '../../api';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      rotation: 0,
      showExpandModal: false
    };
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
      <div className="image-root"
            style={{
              border: '1px solid white',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
              backgroundSize: 'cover',
              backgroundPosition: '50%',
              transform: `rotate(${this.state.rotation}deg)`
            }}>
          <div className="image-icon-section">
              <FontAwesomeIcon icon={faSyncAlt} className="image-icon" name="sync-alt" title="rotate" onClick={() => this.rotateImage()}/>
              <FontAwesomeIcon icon={faTrashAlt} className="image-icon" name="trash-alt" title="delete" onClick={() => this.deleteImage()}/>
              <FontAwesomeIcon icon={faExpand} className="image-icon" name="expand" title="expand" onClick={() => this.expandImage()}/>
          </div>
        <ExpandModal showModal={this.state.showExpandModal} image={this.urlFromDto(this.props.dto)} closeModal={() => this.handleCloseModal()}></ExpandModal>
    </div>
    );
  }
}

export default Image;
