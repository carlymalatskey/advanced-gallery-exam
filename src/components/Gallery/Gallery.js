import React, { useContext } from "react";
import Image from '../Image';
import './Gallery.scss';
import DragItem from "./../DragItem";
import { Grid, GridItem } from "./../Grid";
import GridContext from "./../GridContext";

function Gallery() {
  const { items, moveItem, deleteItem } = useContext(GridContext);

  return (
    <div>
        <div className="gallery-root">
            <Grid>
              {items.map((item, index) => {
                return (
                  <DragItem key={item.id} id={item.id} onMoveItem={moveItem}>
                    <GridItem>
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
            </Grid>
        </div>
    </div>
  );
}

export default Gallery;
