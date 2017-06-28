import * as React from 'react';
import Loadable from 'react-loadable';

const Loading = () => <div>Loading..</div>;

const ShowIndex = Loadable({
  loader: () => _import('./ShowIndex'),
   LoadingComponent: Loading
})

export {
  ShowIndex
}