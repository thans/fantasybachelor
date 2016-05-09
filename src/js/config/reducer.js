import thunk from 'redux-thunk';
import reducers from '../reducers';

export default ($ngReduxProvider) => {
    'ngInject';
    $ngReduxProvider.createStoreWith(reducers, [thunk]);
}