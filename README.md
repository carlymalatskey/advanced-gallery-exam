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
- To delete an image, identified the image id and filtered through the array of images to include the ones that do not have the image id. 
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

  Implemented infinite scrolling by using the onscroll event that checks to see if the user has scrolled to the bottom of the page. Upon reaching the end, the event will load additional content. 
  
  Debounced the event to ensure that it's only called after a certain amount of time before running again. This enables enough time to load the images once it reaches the bottom of the window and improves user performance.

 ```js
     window.onscroll = debounce(() => {
      const {
        getItems,
        state: {
          loading
        },
      } = this;

      if (loading) return;

      // Checks that the page has scrolled to the bottom
      if (
        Math.abs((window.innerHeight + document.documentElement.scrollTop) - document.documentElement.offsetHeight) < 10
      ) {
        this.getItems();
      }
    }, 100);
  }
 ```

 - To check that the user has scrolled to the bottom, compared the sum of the window's inner height with the user's position (scrollTop) to the offset height of the element. If the difference is less than 10px, then the items are fetched to load more. 
    ```js
      Math.abs(
        (window.innerHeight + document.documentElement.scrollTop) - document.documentElement.offsetHeight) < 10
    ```

[![Infinite Scroll](https://media4.giphy.com/media/qd7i9dRyGnA6E9wLN0/giphy.gif)](https://media4.giphy.com/media/qd7i9dRyGnA6E9wLN0/giphy.gif)

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

      const offset = destinationIndex - sourceIndex;

      if (sourceId === -1 || destinationId === -1) {
        return;
      }
    }
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

[![Drag n Drop](https://media2.giphy.com/media/c9NPRMFRsxjTtZIhtl/giphy.gif)](https://media2.giphy.com/media/c9NPRMFRsxjTtZIhtl/giphy.gif)


### Responsiveness

The use of flexbox enables responsiveness.

[![Responsiveness](https://media1.giphy.com/media/qSNs4OHIZw1TCJvlk6/giphy.gif)](https://media1.giphy.com/media/qSNs4OHIZw1TCJvlk6/giphy.gif)

### Frontend notifications

Using react's toastr package, the user receives a notification upon deleting an image. 

[![Frontend Notifications](https://media1.giphy.com/media/DFaPMR0lYpTzGc5Zoi/giphy.gif)](https://media1.giphy.com/media/DFaPMR0lYpTzGc5Zoi/giphy.gif)

### Trending Tags Section 
Upon entering the flickr website, the user is able to see Trending Tags, including "Nature", "Sports", "Arts", "Beach".
Clicking any of the tags directly loads the respective images.

  [![Trending Tags Section](https://media1.giphy.com/media/9kFFwEFypcGwC0UZa5/giphy.gif)](https://media1.giphy.com/media/9kFFwEFypcGwC0UZa5/giphy.gif)

### Website redesign
The website now includes different features, including:  
- Hidden header upon entering a tag: 

  [![Alt text](https://media2.giphy.com/media/9bFNrYSnvb6wzyJSWU/giphy.gif)](https://media2.giphy.com/media/9bFNrYSnvb6wzyJSWU/giphy.gif)


- A navigation bar that includes: 
    - An option to return to the top of the webpage

    [![Alt text](https://media1.giphy.com/media/gs7BTel1asxhU0qq7Z/giphy.gif)](https://media1.giphy.com/media/gs7BTel1asxhU0qq7Z/giphy.gif)

    - A welcome tag that includes the user's name
    - An animated link to [Join the Flickr Community](https://www.flickr.com/)
    - The flickr logo 

- a "Explore Trending Tags" section upon login
- a picture backdrop in the header section 

[![Redesign](https://i.ibb.co/vmSTh8g/Screen-Shot-2021-01-22-at-1-22-20-PM.png)](https://i.ibb.co/vmSTh8g/Screen-Shot-2021-01-22-at-1-22-20-PM.png)

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

# Further TODOs
- Code Refactor: Extract card component to generalized component 