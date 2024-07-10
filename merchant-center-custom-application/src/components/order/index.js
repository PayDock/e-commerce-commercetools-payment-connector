import { lazy } from 'react';

const Order = lazy(() =>
  import('./order' /* webpackChunkName: "Log" */)
);

export default Order;