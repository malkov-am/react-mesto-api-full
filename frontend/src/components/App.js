import { useCallback, useEffect, useState } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/Auth';

function App() {
  // Переменные состояния
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setConfirmDeletePopupOpen] = useState(false);
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [isTooltipSuccess, setIsTooltipSuccess] = useState(false);
  const [cardToDelete, setCardToDelete] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Хук useNavigate
  const navigate = useNavigate();
  // Обработка ошибок
  function handleError(error) {
    console.error(`🔥ERROR: ${error}`);
    setIsTooltipSuccess(false);
    setTooltipOpen(true);
  }
  // Чтение токена
  const token = localStorage.getItem('token');
    // Действия при загрузке приложения: проверяем токен
    useEffect(() => {
      handleTokenCheck();
    }, []);
  // Действия при логине пользователя: запрашиваем данные о пользователе и карточки
  useEffect(() => {
    if(isLoggedIn) {
      api
      .getInitialData(token)
      .then(([initialCards, currentUser]) => {
        setCurrentUser(currentUser);
        setCards(initialCards.reverse());
      })
      .catch((error) => handleError(error));
    };
    if(!isLoggedIn) {
      setCurrentUser({});
    };
  }, [isLoggedIn, token]);

  // Обработчик нажатия на кнопку редактирования профиля
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  // Обработчик нажатия на кнопку добавления карточки
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  // Обработчик нажатия на кнопку редактирования аватара
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  // Обработчик нажатия на иконку удаления
  function handleCardDeleteClick(card) {
    setCardToDelete(card);
    setConfirmDeletePopupOpen(true);
  }
  // Обработчик нажатия на кнопку закрытия попапа
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setConfirmDeletePopupOpen(false);
    setSelectedCard(null);
    setTooltipOpen(false);
  }
  // Обработчик нажатия на изображение в карточке
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  // Обработчик добавления лайка
  function handleCardLike(card) {
    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = card.likes.some((user) => user._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, isLiked, token)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((error) => handleError(error));
  }
  // Обработчик удаления карточки
  function handleCardConfirmDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id, token)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false));
  }
  // Обработчик обновления данных пользователя
  function handleUpdateUser(userData) {
    setIsLoading(true);
    api
      .setProfileData(userData, token)
      .then((updatedUserData) => {
        setCurrentUser(updatedUserData);
        closeAllPopups();
      })
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false));
  }
  // Обработчик обновления аватара пользователя
  function handleUpdateAvatar(avatarData) {
    setIsLoading(true);
    api
      .changeAvatar(avatarData, token)
      .then((updatedUserData) => {
        setCurrentUser(updatedUserData);
        closeAllPopups();
      })
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false));
  }
  // Обработчик добавления новой карточки
  function handleAddPlaceSubmit(cardData) {
    setIsLoading(true);
    api
      .addCard(cardData, token)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false));
  }
  // Обработчик регистрации нового пользователя
  function handleRegisterNewUser(userData) {
    setIsLoading(true);
    auth
      .register(userData)
      .then(() => {
        setIsTooltipSuccess(true);
        setTooltipOpen(true);
        navigate('/sign-in');
      })
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false));
  }
  // Обработчик входа пользователя в систему
  function handleLogin(userData) {
    setIsLoading(true);
    auth
      .authorize(userData)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setIsLoggedIn(true);
          navigate('/');
        }
      })
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false));
  }
  // Обработчик проверки токена
  function handleTokenCheck() {
    if (token) {
      auth
        .checkToken(token)
        .then(() => {
          setIsLoggedIn(true);
          navigate('/');
        })
        .catch((error) => handleError(error));
    }
  };
  // Обработчик выхода пользователя из системы
  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/sign-in');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
  }
  // Открытие / закрытие меню
  function toggleMenu() {
    isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true);
  }

  return (
    <div className="app">
      <div className={`page ${isLoggedIn && !isMenuOpen && 'page_shifted'}`}>
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
        />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Main
                    cards={cards}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDeleteClick}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sign-up"
              element={<Register isLoading={isLoading} onRegisterNewUser={handleRegisterNewUser} />}
            />
            <Route
              path="/sign-in"
              element={<Login isLoading={isLoading} onLogin={handleLogin} />}
            />
            <Route path="*" element={<Login isLoading={isLoading} onLogin={handleLogin} />} />
          </Routes>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
          />
          <ConfirmDeletePopup
            isOpen={isConfirmDeletePopupOpen}
            onClose={closeAllPopups}
            cardToDelete={cardToDelete}
            onConfirmDelete={handleCardConfirmDelete}
            isLoading={isLoading}
          />
          <EditAvatarPopup
            onClose={closeAllPopups}
            isOpen={isEditAvatarPopupOpen}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />
          <ImagePopup selectedCard={selectedCard} onClose={closeAllPopups} />
          <InfoTooltip
            isOpen={isTooltipOpen}
            isSuccess={isTooltipSuccess}
            onClose={closeAllPopups}
          />
          <Footer />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
