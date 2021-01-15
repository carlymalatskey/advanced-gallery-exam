import React from 'react';
import Modal from 'react-modal';
import './ExpandModal.scss';

class ExpandModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        Modal.setAppElement('body'); 
      }

    render() {
        return (
            <Modal isOpen={this.props.showModal} portalClassName="modal">
               <img src={this.props.image} className="expanded-img"/>
            </Modal>
        )
    }
}

export default ExpandModal; 