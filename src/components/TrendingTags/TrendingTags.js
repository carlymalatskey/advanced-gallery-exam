import './TrendingTags.scss';

import React from 'react';
import { Card } from 'react-bootstrap';
import sportsTag from "./../../assets/sportsTag.jpeg";
import natureTag from "./../../assets/natureTag.jpg";
import artsTag from "./../../assets/artsTag.jpeg";
import beachTag from "./../../assets/beachTag.jpg";

class TrendingTags extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChooseTag = (tag) => {
        this.props.changeTag(tag);
    }

    render() {
        return (
            <div className="trending-section">
                <div>Explore Trending Tags</div>
                <div className="cards">
                  <Card className="card" onClick={() => this.handleChooseTag('nature')} style={{backgroundImage: `url(${natureTag})`, backgroundSize: "29vw 19vw"}}>
                    <Card.Body>
                        <Card.Title className="card-title">Nature</Card.Title>
                    </Card.Body>
                  </Card>
                  <Card className="card" onClick={() => this.handleChooseTag('sports')}
                    style={{backgroundImage: `url(${sportsTag})`, backgroundSize: "25vw 21vw"}}>
                    <Card.Body>
                      <Card.Title>Sports</Card.Title>
                    </Card.Body>
                  </Card>
                  <Card className="card" onClick={() => this.handleChooseTag('arts')}
                    style={{backgroundImage: `url(${artsTag})`, backgroundSize: "24vw 19vw"}}>
                    <Card.Body>
                      <Card.Title>Arts</Card.Title>
                    </Card.Body>
                  </Card>
                  <Card className="card" onClick={() => this.handleChooseTag('beach')} 
                    style={{backgroundImage: `url(${beachTag})`, backgroundSize: "22vw 19vw"}}>
                    <Card.Body>
                      <Card.Title>Beach</Card.Title>
                    </Card.Body>
                  </Card>
                </div>
              </div>
        );
    }
}

export default TrendingTags;
