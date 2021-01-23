import React, { useContext } from "react";
import Image from '../Image';
import './Gallery.scss';
import DragItem from "./DragItem";
import GridContext from "../App/GridContext";

const GridItem = ({ forwardedRef, ...props }) => (
  <div ref={forwardedRef} {...props} className="grid-item" />
);

function Gallery() {
  const { items, moveItem, deleteItem, totalItems } = useContext(GridContext);

  return (
    <div>
        <div className="gallery-root">
            {items.length > 0 ? 
              <div className="displaying-label">Displaying [{items.length}/{totalItems}]</div>
              : 
              <div></div>
            }
            <div className="grid">
              {items.map((item, index) => {
                return (
                  <DragItem key={item.id} id={item.id} onMoveItem={moveItem}>
                    <GridItem >
                      <Image
                        key={index} 
                        dto={item} 
                        index={index} 
                        handleDelete={(imageId) => deleteItem(imageId)}
                      />
                    </GridItem>
                  </DragItem>
                )
              })
            }
            </div>
        </div>
    </div>
  );
}

export default Gallery;
