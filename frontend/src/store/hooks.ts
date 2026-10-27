import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

// Типизированные хуки: компоненты сразу знают тип состояния и dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
