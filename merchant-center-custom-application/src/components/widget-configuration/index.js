import { lazy } from 'react';

const WidgetConfiguration = lazy(() =>
  import('./widget-configuration' /* webpackChunkName: "WidgetConfiguration" */)
);

export default WidgetConfiguration;