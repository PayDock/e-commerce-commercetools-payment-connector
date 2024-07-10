import { lazy } from 'react';

const SandboxConnection = lazy(() =>
  import('./sandbox-connection' /* webpackChunkName: "SandboxConnection" */)
);

export default SandboxConnection;