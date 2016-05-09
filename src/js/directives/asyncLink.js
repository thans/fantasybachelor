import angular from 'angular';

export const ASYNC_LINK_STATE_CHANGE = 'ASYNC_LINK_STATE_CHANGE';
export const ASYNC_LINK_STATE = {
    LOADING : 'LOADING',
    LOADED : 'LOADED'
};

export default function asyncLink($ngRedux) {
    'ngInject';
    return {
        restrict : 'E',
        link : ($scope, element, attrs) => {
            let linkElement = angular.element('<link href=' + attrs.href + ' rel="stylesheet" type="text/css" />');
            linkElement[0].onload = () => {
                $ngRedux.dispatch({
                    type : ASYNC_LINK_STATE_CHANGE,
                    url : attrs.href,
                    state : ASYNC_LINK_STATE.LOADED
                })
            };
            element.append(linkElement);
            $ngRedux.dispatch({
                type : ASYNC_LINK_STATE_CHANGE,
                url : attrs.href,
                state : ASYNC_LINK_STATE.LOADING
            });
        }
    };
}
