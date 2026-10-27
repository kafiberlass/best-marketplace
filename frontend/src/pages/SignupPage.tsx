import { Link } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { useForm } from 'react-hook-form';
import AuthLayout, { AuthActions, AuthForm, AuthLinks, FieldError } from '../components/AuthLayout';
import { Button, ErrorMessage, Field, FieldLabel, Input } from '../components/ui';
import { getErrorMessage } from '../api';
import type { SignupData, User } from '../types';
import { signupRequest } from '../store/actions';

const MIN_PASSWORD_LENGTH = 6;

function SignupPage() {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>({ defaultValues: { login: '', password: '', repeatPassword: '' } });

  const onSubmit = (data: SignupData) =>
    new Promise<User>((resolve, reject) => dispatch(signupRequest(data, { resolve, reject }))).catch((error: unknown) =>
      setError('root.server', { message: getErrorMessage(error) })
    );

  return (
    <AuthLayout>
      <AuthForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>Регистрация</h1>
        {errors.root?.server && <ErrorMessage role="alert">{errors.root.server.message}</ErrorMessage>}

        <Field>
          <FieldLabel>Логин</FieldLabel>
          <Input
            autoComplete="username"
            aria-invalid={Boolean(errors.login)}
            {...register('login', {
              required: 'Придумайте логин',
              pattern: {
                value: /^[a-zA-Z0-9_.-]{3,32}$/,
                message: 'От 3 до 32 символов: латинские буквы, цифры, «_», «.» или «-»',
              },
            })}
          />
          {errors.login && <FieldError role="alert">{errors.login.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Пароль</FieldLabel>
          <Input
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password', {
              required: 'Придумайте пароль',
              minLength: { value: MIN_PASSWORD_LENGTH, message: `Не короче ${MIN_PASSWORD_LENGTH} символов` },
            })}
          />
          {errors.password && <FieldError role="alert">{errors.password.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Повторите пароль</FieldLabel>
          <Input
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.repeatPassword)}
            {...register('repeatPassword', {
              required: 'Повторите пароль',
              // watch следит за полем "Пароль" и сравнивает значения
              validate: (value) => value === watch('password') || 'Пароли не совпадают',
            })}
          />
          {errors.repeatPassword && <FieldError role="alert">{errors.repeatPassword.message}</FieldError>}
        </Field>

        <AuthLinks>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </AuthLinks>

        <AuthActions>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Регистрируем…' : 'Зарегистрироваться'}
          </Button>
        </AuthActions>
      </AuthForm>
    </AuthLayout>
  );
}

export default SignupPage;
