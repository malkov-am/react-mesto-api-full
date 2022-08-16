import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useValidation from '../hooks/useValidation';
import AuthForm from './AuthForm';

const Register = ({ onRegisterNewUser, isLoading }) => {
  // Валидация формы
  const { values, errors, isValid, handleChange, resetForms } = useValidation('.form');
  // Обработчик нажатия кнопки регистрации
  function handleSubmit(evt) {
    evt.preventDefault();
    onRegisterNewUser({ email: values.email, password: values.password });
  }
  // Сброс полей формы при открытии
  useEffect(() => {
    resetForms();
  }, []);
  return (
    <div className="main">
      <AuthForm
        name="sign-up-form"
        title="Регистрация"
        btnTitle={!isLoading ? 'Зарегистрироваться' : 'Регистрация...'}
        onSubmit={handleSubmit}
        isValid={isValid}
      >
        <input
          id="email"
          name="email"
          type="email"
          className="form__input form__input_theme_dark"
          placeholder="Email"
          aria-label="Email"
          required
          onChange={handleChange}
          value={values.email || ''}
        />
        <span className="form__error-message email-error">{errors.email}</span>
        <input
          id="password"
          name="password"
          type="password"
          className="form__input form__input_theme_dark"
          placeholder="Пароль"
          aria-label="Пароль"
          required
          minLength="6"
          maxLength="14"
          onChange={handleChange}
          value={values.password || ''}
        />
        <span className="form__error-message password-error">{errors.password}</span>
      </AuthForm>
      <p className="main__text">
        Уже зарегистрированы?{' '}
        <Link className="main__link" to="/sign-in">
          Войти
        </Link>
      </p>
    </div>
  );
};

export default Register;
