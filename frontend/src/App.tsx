import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { Switch, Route, Redirect } from 'react-router-dom';
import { restoreSession } from './store/actions';
import { selectAuthStatus } from './store/selectors';
import { withAuth, withGuest } from './routes/withAuth';
import { Centered, Muted } from './components/ui';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import MyOrdersPage from './pages/MyOrdersPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Корзина и заказы - только для авторизованных, вход и регистрация - только для гостей.
// Каталог и страница товара доступны всем
const Cart = withAuth(CartPage);
const MyOrders = withAuth(MyOrdersPage);
const Login = withGuest(LoginPage);
const Signup = withGuest(SignupPage);

function App() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (authStatus === 'checking') {
    return (
      <Centered>
        <Muted>Загрузка…</Muted>
      </Centered>
    );
  }

  return (
    <Switch>
      <Route exact path="/" component={ProductsPage} />
      <Route path="/products/:id" component={ProductPage} />
      <Route path="/cart" component={Cart} />
      <Route path="/my-orders" component={MyOrders} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Redirect to="/" />
    </Switch>
  );
}

export default App;
