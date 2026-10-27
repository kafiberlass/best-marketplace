import { Link } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { useForm } from 'react-hook-form';
import AuthLayout, { AuthActions, AuthForm, AuthLinks, FieldError } from '../components/AuthLayout';
import { Button, ErrorMessage, Field, FieldLabel, Input } from '../components/ui';
import { getErrorMessage } from '../api';
import type { Credentials, User } from '../types';
import { loginRequest } from '../store/actions';

function LoginPage() {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Credentials>({ defaultValues: { login: '', password: '' } });

  // Запрос выполняет сага, результат возвращается через resolve/reject.
  // После успешного входа withGuest сам перенаправит пользователя туда, откуда он пришёл
  const onSubmit = (data: Credentials) =>
    new Promise<User>((resolve, reject) => dispatch(loginRequest(data, { resolve, reject }))).catch((error: unknown) =>
      setError('root.server', { message: getErrorMessage(error) })
    );

  return (
    <AuthLayout>
      <AuthForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>Вход</h1>
        {errors.root?.server && <ErrorMessage role="alert">{errors.root.server.message}</ErrorMessage>}

        <Field>
          <FieldLabel>Логин</FieldLabel>
          <Input autoComplete="username" aria-invalid={Boolean(errors.login)} {...register('login', { required: 'Введите логин' })} />
          {errors.login && <FieldError role="alert">{errors.login.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Пароль</FieldLabel>
          <Input
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password', { required: 'Введите пароль' })}
          />
          {errors.password && <FieldError role="alert">{errors.password.message}</FieldError>}
        </Field>

        <AuthLinks>
          Впервые в BestMarketPlace? <Link to="/signup">Создать аккаунт</Link>
        </AuthLinks>

        <AuthActions>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Входим…' : 'Войти'}
          </Button>
        </AuthActions>
      </AuthForm>
    </AuthLayout>
  );
}

export default LoginPage;
