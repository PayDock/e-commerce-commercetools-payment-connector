import { lazy } from 'react';

const LiveConnection = lazy(() =>
  import('./live-connection' /* webpackChunkName: "LiveConnection" */)
);

export default LiveConnection;