import successIconPath from '../images/infotooltip-success-icon.svg';
import errorIconPath from '../images/infotooltip-error-icon.svg';
import Popup from './Popup';

const InfoTooltip = ({ isOpen, isSuccess, onClose }) => {
  return (
    <Popup
      name="info-tooltip"
      isOpen={isOpen}
      onClose={onClose}
      containerSelector="popup__container"
    >
      <div className="popup__info-tooltip">
        <img
          className="popup__status-image"
          src={isSuccess ? successIconPath : errorIconPath}
          alt={isSuccess ? 'Иконка успешной регистрации' : 'Иконка ошибки'}
        />
        <p className="popup__message">
          {isSuccess
            ? 'Вы успешно зарегистрировались!'
            : 'Что-то пошло не так! Попробуйте ещё раз.'}
        </p>
      </div>
      <button
        className="popup__close-button"
        title="Закрыть"
        type="button"
        aria-label="Закрыть форму"
        onClick={onClose}
      ></button>
    </Popup>
  );
};

export default InfoTooltip;
