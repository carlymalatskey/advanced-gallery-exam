import React from 'react';
import Modal from 'react-modal';
import './ExpandModal.scss';

const customModalStyle = {
    content : {
      background: '#0000ff6b',
      textAlign: 'center'
    }
  };

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
            <Modal isOpen={this.props.showModal} style={customModalStyle}>
                {/* <div> */}
                    <img src={this.props.image} className="expanded-img"/>
                {/* </div> */}
               <button onClick={() => this.props.closeModal()} className={"close-button"}>Close</button>
            </Modal>
        )
    }
}

export default ExpandModal; 