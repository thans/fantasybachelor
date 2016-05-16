export default function facebookSdk($ngRedux, facebookService) {
    'ngInject';

    var fbAsyncInit = () => {
        $ngRedux.dispatch(facebookService.init());
    };
    
    if (FB) { return fbAsyncInit(); }
    window.fbAsyncInit = fbAsyncInit;
}