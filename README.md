# Carly Malatskey's Flickr Gallery
Here you'll find Carly's submission for the Wix Flickr Gallery exercise.

# Implemented Features
1) Delete, Rotate, Expand an image
2) Infinite Scrolling
3) Drag-n-Drop
4) Responsiveness
5) Frontend notifications
6) Trending Tags Section
7) Website redesign
8) User analytics
9) Tech Design

### Delete, Rotate, Expand an Image
- To delete an image, identified the image id and filtered out the images in the gallery that do not have the image Id
  ```js
  deleteItem = (id) => {
    const newSetOfImages = this.state.items.filter(image => image.id != id);
    this.setItems(newSetOfImages);
  }
  ```
- To rotate an image, implemented the transform property in the image's style to rotate by 90 degrees each time the rotate button is clicked.

  ```js
    rotateImage() {
      let newRotation = 90 + this.state.rotation;
      this.setState ({
        rotation: newRotation
      });
    }
  ```
  ```css
      style={{
          transform: `rotate(${this.state.rotation}deg)`
        }}
  ```

- To expand an image, added a modal that pops up to display the image and closes upon clicking the "close" button 

  [![Alt text](https://media0.giphy.com/media/0wqU19894rKNReNx1y/giphy.gif)](https://media0.giphy.com/media/0wqU19894rKNReNx1y/giphy.gif)

### Infinite Scrolling

Implemented React's IntersectionObserver API, which enables us to observe changes in the "intersection of a target element with an ancestor element or with a top-level document's viewport."

*enter explanation*

  ```js
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
  ```

  ```js
  handleObserver = (entities, observer) => {
    if (this.state.items.length > 0) {
      const y = entities[0].boundingClientRect.y;
      if (this.state.prevY > y) {
        this.getItems();
      }
      this.setState({ prevY: y });
    }
  }
  ```

[![Alt text](https://media0.giphy.com/media/sOULwm2BbPS4oTeBwl/giphy.gif)](https://media0.giphy.com/media/sOULwm2BbPS4oTeBwl/giphy.gif)

### Drag-n-Drop
Implemented react-dnd package to enable users to drag and drop images. 

- Dragging individual images is handled by using the useDrag and the useDrop properties inside of the react-dnd package:
  ```js
    const DragItem = memo(({ id, onMoveItem, children }) => {
    const ref = useRef(null);

    const [{ isDragging }, connectDrag] = useDrag({
      item: { id, type: "IMG" },
      collect: monitor => {
        return {
          isDragging: monitor.isDragging()
        };
      }
    });

    const [, connectDrop] = useDrop({
      accept: "IMG",
      hover(hoveredOverItem) {
        if (hoveredOverItem.id !== id) {
          onMoveItem(hoveredOverItem.id, id);
        }
      }
    });
  ```

- The re-ordering of images is handled first by taking the index of the source image (the image being dragged) and the index of the destination image (the image that is being hovered) by taking the image's id.
  ``` js
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
    }
  ```
- This function also establishes an offset that will then be added to the index:
  ```js
  const offset = destinationIndex - sourceIndex;
  ```

- Then, the function changes the state of the items by calling the moveItems function, passing in the current state of items, the index of the source image and the offset
  ```js
  this.setState(state => ({
    items: moveElement(state.items, sourceIndex, offset)
  }));
  ```

- The moveElement function establishes a new index for the dragged image to be placed by adding the original index and the offset that is established in the moveItem function above. Then, this function returns the move function by passing in the array of items, the previous index, and the new index:
  ```js
  function moveElement(array, index, offset) {
    const newIndex = index + offset;

    return move(array, index, newIndex);
  }
  ```
 - The move function reshuffles the images in the array by using the splice method to place the dragged image at the new index:
    ``` js
    function move(array, oldIndex, newIndex) {
      if (newIndex >= array.length) {
        newIndex = array.length - 1;
      }
      array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
      return array;
    }
    ```



[![Alt text](https://media2.giphy.com/media/c9NPRMFRsxjTtZIhtl/giphy.gif)](https://media2.giphy.com/media/c9NPRMFRsxjTtZIhtl/giphy.gif)


### Responsiveness

The use of flexbox enables responsiveness.

[![Alt text](https://media1.giphy.com/media/qSNs4OHIZw1TCJvlk6/giphy.gif)](https://media1.giphy.com/media/qSNs4OHIZw1TCJvlk6/giphy.gif)

### Frontend notifications

Using react's toastr package, the user receives a notification upon deleting an image. 

[![Alt text](https://media1.giphy.com/media/DFaPMR0lYpTzGc5Zoi/giphy.gif)](https://media1.giphy.com/media/DFaPMR0lYpTzGc5Zoi/giphy.gif)

### Trending Tags Section 
Upon entering the flickr website, the user is able to see Trending Tags, including "Nature", "Sports", "Arts", "Beach".
Clicking any of the tags directly retrieves the respective images from the flickr API. 

[![Alt text](https://media4.giphy.com/media/AzWszUpmjIreONc872/giphy.gif)](https://media4.giphy.com/media/AzWszUpmjIreONc872/giphy.gif)

### Website redesign
The website now includes different features, including:  
- A fixed navigation bar that includes: 
    - A "back to top" link to always return to the top of the webpage

    [![Alt text](https://media3.giphy.com/media/Basy1YJPoZAk6m9d9Q/giphy.gif)](https://media3.giphy.com/media/Basy1YJPoZAk6m9d9Q/giphy.gif)

    - A welcome tag that includes the user's name
    - An animated link to [Join the Flickr Community](https://www.flickr.com/)
    - The flickr logo 
- a "Explore Trending Tags" section upon login
- a picture backdrop in the header section 

[![Alt text](https://i.ibb.co/vmSTh8g/Screen-Shot-2021-01-22-at-1-22-20-PM.png)](https://i.ibb.co/vmSTh8g/Screen-Shot-2021-01-22-at-1-22-20-PM.png)

### User analytics
Used SolarWinds Loggly to write logs on user behavior - including when a user changes a tag, deletes, rotates, expands an image, and when the user reaches the end of the page. The analytics also include the new tag and the respective image ID. 

Individual Analytic Data

[![Alt text](https://i.ibb.co/Cs5T8gp/Individual-Data-Tag.png)](https://i.ibb.co/Cs5T8gp/Individual-Data-Tag.png)

Analytics Log
[![Alt text](https://i.ibb.co/R27FQYp/DataLog.png)](https://i.ibb.co/R27FQYp/DataLog.png)

Analytics Graph
[![Alt text](https://i.ibb.co/MP47gYg/Data-Graph.png)](https://i.ibb.co/MP47gYg/Data-Graph.png)

[Explore Loggly](https://www.loggly.com/)

# Tech Design
- Leveraged ReactJS + NodeJS (Webpack) to serve the static website
- Used Loggly to write logs on user behavior
- Enabled user to enter their name upon entry onto the website

[![Alt text](https://i.ibb.co/2k3hyTb/Screen-Shot-2021-01-22-at-3-13-39-PM.png)](https://i.ibb.co/2k3hyTb/Screen-Shot-2021-01-22-at-3-13-39-PM.png)