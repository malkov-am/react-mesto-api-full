import React from 'react';
import Popup from './Popup';

const PopupWithForm = ({
  name,
  title,
  isOpen,
  onClose,
  btnTitle,
  children,
  onSubmit,
  isValid,
}) => {
  return (
    <Popup
      name={name}
      isOpen={isOpen}
      onClose={onClose}
      containerSelector="popup__container"
    >
      <form className="form" name={name} noValidate onSubmit={onSubmit}>
        <h2 className="form__header">{title}</h2>
        {children}
        <button
          className={`${
            !isValid && 'form__save-button_inactive'
          } form__save-button form__save-button_theme_light`}
          title={btnTitle}
          type="submit"
          disabled={!isValid}
        >
          {btnTitle}
        </button>
      </form>
    </Popup>
  );
};

export default PopupWithForm;
