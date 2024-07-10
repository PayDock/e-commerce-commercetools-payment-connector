import { lazy } from 'react';

const Log = lazy(() =>
  import('./log' /* webpackChunkName: "Log" */)
);

export default Log;