const AuthForm = ({ name, title, children, isValid, btnTitle, onSubmit }) => {
  return (
    <div className="sign">
      <form className="form" name={name} noValidate onSubmit={onSubmit}>
        <h2 className="form__header form__header_theme_dark">{title}</h2>
        {children}
        <button
          className={`${
            !isValid && 'form__save-button_inactive'
          } form__save-button form__save-button_theme_dark`}
          title={btnTitle}
          type="submit"
          disabled={!isValid}
        >
          {btnTitle}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
