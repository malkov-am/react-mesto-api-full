import React, { useEffect } from 'react';

const Popup = ({ name, isOpen, onClose, children, containerSelector }) => {
  // Установка и снятие слушателя закрытия попапа по Escape
  useEffect(() => {
    if (!isOpen) return;
    const closeByEscape = (evt) => evt.key === 'Escape' && onClose();
    document.addEventListener('keydown', closeByEscape);
    return () => document.removeEventListener('keydown', closeByEscape);
  }, [isOpen, onClose]);
  // Обработчик клика по оверлею
  const handleOverlayClick = (evt) => evt.target === evt.currentTarget && onClose();

  return (
    <div
      className={`popup popup_light popup_type_${name} ${isOpen && 'popup_opened'}`}
      onClick={handleOverlayClick}
    >
      <div className={containerSelector}>
        {children}
        <button
          className="popup__close-button"
          title="Закрыть"
          type="button"
          aria-label="Закрыть форму"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
};

export default Popup;
