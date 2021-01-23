import './LoginForm.scss';

import React from 'react';
import { Form, Button } from 'react-bootstrap';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputName: ''
        }
    }

    handleNameInputChange = (e) => {
        this.setState({
          inputName: e.target.value
        })
    }

    render() {
        return (
            <div>
                <div className="enter-name-form">
                    <Form>            
                    <Form.Label style={{fontSize: "2.8vw"}}>Enter your name to access your Flickr Gallery:</Form.Label>
                    <Form.Group>
                        <Form.Control type="text" 
                                    placeholder="Enter name" 
                                    className="name-input" 
                                    onChange={(e) => this.handleNameInputChange(e)} 
                                    value={this.state.inputName}/>
                    </Form.Group>
                    </Form>
                    <Button type="submit" className="submit-button" onClick={() => this.props.handleSubmitName(this.state.inputName)}>Submit</Button>
                </div>
            </div>
        );
    }
}

export default LoginForm;
