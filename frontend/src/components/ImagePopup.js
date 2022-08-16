import React from 'react';
import Popup from './Popup';

const ImagePopup = ({ selectedCard, onClose }) => {
  return (
    <Popup
      name="image"
      isOpen={selectedCard}
      onClose={onClose}
      containerSelector="popup__image-container"
    >
      <figure className="popup__figure">
        <img className="popup__image" src={selectedCard?.link} alt={selectedCard?.name} />
        <figcaption className="popup__image-caption">{selectedCard?.name}</figcaption>
      </figure>
    </Popup>
  );
};

export default ImagePopup;
