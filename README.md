# Carly Malatskey's Flickr Gallery
Here you'll find Carly's documentation for the Wix Flickr Gallery exercise.

# Table of contents

### Required Features
1) Delete, Rotate, Expand an image
2) Infinite Scrolling
3) Drag-n-Drop
4) Responsiveness

[![Alt text](https://i.ibb.co/z8Mjrts/drag-drop-demo.png)](https://i.ibb.co/z8Mjrts/drag-drop-demo.png)

### Creative Features
1) Frontend notifications
2) Trending Tags Section
3) Website redesign
4) User analytics

[![Alt text](https://i.ibb.co/jrL57QP/trending-tags.png)](https://i.ibb.co/jrL57QP/trending-tags.png)

### More Thoughts
1) Tech design 
2) Further TODOs

***

# Required Features

## 1. Delete, Rotate, Expand an Image
- *DELETE*: To delete an image, we identify the image `id` and filter through the existing images to include the ones that do not have the image id. We can use the built-in `filter` function for this.
  ```js
  deleteItem = (id) => {
    const newSetOfImages = this.state.items.filter(image => image.id != id);
    this.setItems(newSetOfImages);
  }
  ```
- *ROTATE:* To rotate an image, we will leverage the `transform` CSS property in order to cause a 90 degree rotation on every click. The rotation amount is specifically determined in the `state` of each separate `Image` entity and thus each image can be rotated to a different degree without collisions. 

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

- *EXPAND:* To expand an image, we use a modal that pops up to display the image and closes upon clicking the "close" button. Every `Image` instance has an `ExpandModal` element as its child, such that it controls that element's `open` and `close` functionalities through props. The image to display is also passed through the same `props`.

  [![Alt text](https://media0.giphy.com/media/0wqU19894rKNReNx1y/giphy.gif)](https://media0.giphy.com/media/0wqU19894rKNReNx1y/giphy.gif)

## 2. Infinite Scrolling

  To implement infinite scrolling, we leverage the `onscroll` event listener on the `window` global object. In order to determine if the user has scrolled to the bottom of the page, we leverage three known values at that moment: `document offset, inner height, scrollTop`. Document offset gives us the entire height, in pixels, of the HTML document. Inner height provides, in pixels, the height of the window that the website is running on. Scroll top provides the distance, in pixels, between our current visible window and the top of the document. The equation seen below represents the `if condition` which determines whether the user has reached the bottom.
  
  We use the `debouncing` mechanism provided by `lodash` in order to avoid making excessive calls, believing that the user has reached the bottom multiple times. This enables enough time to load the images once the user reaches the bottom of the window and provides a better user experience. If we were to avoid the `debouncing` mechanism, the program would believe the user is in the bottom while it's fetching the photos, making numerous calls to fetch more data, an unwanted behavior. 

Creating the event listener for the `onscroll`, and providing the `if condition` to determine fetching new data:
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

 The decision to check for a maximum distance of 10, is to allow the program to begin fetching more data when the user is close to the bottom rather than having reached the bottom. From a user experiece perspective, if the user reaches the bottom at a distance of 10 pixels, it is highly likely they would like to see more images.

  ```js
    Math.abs(
      (window.innerHeight + document.documentElement.scrollTop) - document.documentElement.offsetHeight) < 10
  ```

[![Infinite Scroll](https://media4.giphy.com/media/qd7i9dRyGnA6E9wLN0/giphy.gif)](https://media4.giphy.com/media/qd7i9dRyGnA6E9wLN0/giphy.gif)

## 3. Drag-n-Drop
Implement react-dnd package to enable users to drag and drop images. 

- Dragging individual images is handled by using the `useDrag` and the `useDrop` properties inside of the react-dnd package. In these properties, there is respective information that is passed as a ref to the element. For instance, the `useDrag` hook has an item type that carries information about the dragged item. In this case, the item type is an "IMG". The `useDrop` hook has a property called `accept` that knows only to accept items of a certain type (in this case, the type is "IMG"). Then, we are cloning each child of `DragItem`, which is the `GridItem`, and attaching a ref to it. 
So, each `GridItem` is able to have a ref that includes the `drag` and `drop` connector functions as well as a `style` property, which sets the opacity of the image. 

  ```js
    const DragItem = memo(({ id, onMoveItem, children }) => {
      const ref = useRef(null);

      const [{ isDragging }, drag] = useDrag({
        item: { id, type: "IMG" },
        collect: monitor => {
          return {
            isDragging: monitor.isDragging()
          };
        }
      });

      const [, drop] = useDrop({
        accept: "IMG",
        hover(hoveredOverItem) {
          if (hoveredOverItem.id !== id) {
            onMoveItem(hoveredOverItem.id, id);
          }
        }
      });

      drag(ref);
      drop(ref);

    const opacity = isDragging ? 0.5 : 1;
    const containerStyle = { opacity };

    return React.Children.map(children, child =>
      React.cloneElement(child, {
        forwardedRef: ref,
        style: containerStyle
      })
    );
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

- Then, the function changes the state of the items by calling the `moveElement` function, passing in the current state of items, the index of the source image and the offset.
  ```js
  this.setState(state => ({
    items: moveElement(state.items, sourceIndex, offset)
  }));
  ```
- The `moveElement` function creates a new `destinationIndex` by adding the offset to the `sourceIndex` of the dragged image. Then, the function checks whether the `destinationIndex` is greater than the array's length. If it is, then the `destinationIndex` becomes the last element of the array.

- The function then handles the re-ordering of elements by using two `splice` methods simultaneously. At the `destinationIndex`, zero elements are removed and the element that is inserted is the element at the `sourceIndex`. These two methods need to be performed at the same time because the array would change already on the internal `array.splice`, if it were to be performed prior to the outer `array.splice`, and thus making the `destinationIndex` inconsistent with the new array.

  ```js
    function moveElement(array, sourceIndex, offset) {
      const destinationIndex = sourceIndex + offset;
    
      if (destinationIndex >= array.length) {
          destinationIndex = array.length - 1;
      }
      array.splice(destinationIndex, 0, array.splice(sourceIndex, 1)[0]);

      return array;
    }
  ```

[![Drag n Drop](https://media2.giphy.com/media/c9NPRMFRsxjTtZIhtl/giphy.gif)](https://media2.giphy.com/media/c9NPRMFRsxjTtZIhtl/giphy.gif)


## 4. Responsiveness

Although there are variety of ways to implement a responsive grid-like application, the `flex` CSS property provides the most verasatile and understandable mechanism. The top `div` has a `flex` property such that its direction is `columns`, to allow for the three sections to be piled on top of each other. The gallery, however, has a `flex` property with direction of `rows  ` so that the elements are adjacent to each other. 

[![Responsiveness](https://media1.giphy.com/media/qSNs4OHIZw1TCJvlk6/giphy.gif)](https://media1.giphy.com/media/qSNs4OHIZw1TCJvlk6/giphy.gif)

***

# Creative Features

## 1. Trending Tags Section 
Upon entering the website, the user is able to see Trending Tags, including: "Nature", "Sports", "Arts", "Beach".
Clicking any of the tags directly loads the respective images and modifies the app header to be slimmer. 

  [![Trending Tags Section](https://media1.giphy.com/media/9kFFwEFypcGwC0UZa5/giphy.gif)](https://media1.giphy.com/media/9kFFwEFypcGwC0UZa5/giphy.gif)

## 2. Session maintenance

In order to be able to follow a user's journey, gain insights and continue improving based on users' actions, we need a way to identify the user on the website and whether they come back to it. While it would be ideal to implement a fully-functioning login authentication system (see `Further TODOs` section), we will provide with a minimal implementation that suffices for now. 

Each user is identified by a username (not necessarily unique, it would be better to use a `uuid`). This username will be assigned to the session `Cookie` upon entering the website for the first time:

[![Alt text](https://i.ibb.co/2k3hyTb/Screen-Shot-2021-01-22-at-3-13-39-PM.png)](https://i.ibb.co/2k3hyTb/Screen-Shot-2021-01-22-at-3-13-39-PM.png)

Once the user "registers" (our minimal implementation), the cookie is assigned and actions are documented with the username in mind. This allows us, as observed in the analytics section, to determine a users' journey and gain insights to what features are liked, disliked and ignored. 

## 3. Frontend notifications

Using react's `toastr` package, the user receives a notification upon deleting an image. 

[![Frontend Notifications](https://media1.giphy.com/media/DFaPMR0lYpTzGc5Zoi/giphy.gif)](https://media1.giphy.com/media/DFaPMR0lYpTzGc5Zoi/giphy.gif)

## 4. Website redesign
The website now includes different features, including:  
- Hidden header upon entering a tag: 

  [![Alt text](https://media2.giphy.com/media/9bFNrYSnvb6wzyJSWU/giphy.gif)](https://media2.giphy.com/media/9bFNrYSnvb6wzyJSWU/giphy.gif)


- A navigation bar that includes: 
    - An option to return to the top of the webpage

    [![Alt text](https://media1.giphy.com/media/gs7BTel1asxhU0qq7Z/giphy.gif)](https://media1.giphy.com/media/gs7BTel1asxhU0qq7Z/giphy.gif)

    - A welcome tag that includes the user's name
    - A CSS3-based animation for the link to [Join the Flickr Community](https://www.flickr.com/)
    - The flickr logo 

- an "Explore Trending Tags" section upon login
- a picture backdrop in the header section 

[![Redesign](https://i.ibb.co/vmSTh8g/Screen-Shot-2021-01-22-at-1-22-20-PM.png)](https://i.ibb.co/vmSTh8g/Screen-Shot-2021-01-22-at-1-22-20-PM.png)

## 5. User analytics
In order to capture user events, we leverage the BI (Business Intelligence) tool SolarWinds Loggly to write logs on user behavior, including when a user changes a tag, deletes, rotates and expands an image, and when the user reaches the end of the page. The logs map to users based on the non-unique (in retrospective it would be wiser to use `id`) name property, along with identifiable `ids` for the elements (such as image `id` and `tag`). 

Individual Analytic Data

[![Alt text](https://i.ibb.co/Cs5T8gp/Individual-Data-Tag.png)](https://i.ibb.co/Cs5T8gp/Individual-Data-Tag.png)

Analytics Log
[![Alt text](https://i.ibb.co/R27FQYp/DataLog.png)](https://i.ibb.co/R27FQYp/DataLog.png)

Analytics Graph
[![Alt text](https://i.ibb.co/MP47gYg/Data-Graph.png)](https://i.ibb.co/MP47gYg/Data-Graph.png)

[Explore Loggly](https://www.loggly.com/)

***

# More thoughts

## 1. Tech Design
- Leveraged ReactJS + NodeJS (Express) to serve the static website
- An `Express` web server to allow an endpoint for creating a user with a Cookie and sending the logs to `Loggly`
- Used Loggly to write logs on user behavior

## 2. Further TODOs
- Code Refactor: Extract card component to generalized component 
- Login Authentication: Enabling user to enter authentication details to login, integrating a unique `id` for each user instead of their name. 
- Search History: Give the user the ability to see their search history of previous tags they've searched 
- Image Details: Upon clicking on the image, the user can see more details about each image, including: the location of the image, the time it was taken, and a caption describing the content.
