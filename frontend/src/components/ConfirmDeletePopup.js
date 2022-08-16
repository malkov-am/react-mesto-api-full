import React from 'react';
import PopupWithForm from './PopupWithForm';

const ConfirmDeletePopup = ({ isOpen, onClose, cardToDelete, onConfirmDelete, isLoading }) => {
  // Обработчик подтверждения удаления карточки
  function handleSubmit(evt) {
    evt.preventDefault();
    onConfirmDelete(cardToDelete);
  }

  return (
    <PopupWithForm
      name="confirm-form"
      title="Вы уверены?"
      btnTitle={!isLoading ? 'Да' : 'Удаление...'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isValid={true}
    />
  );
};

export default ConfirmDeletePopup;
