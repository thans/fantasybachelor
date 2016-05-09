export default function facebookSdk($ngRedux, facebookService) {
    'ngInject';
    window.fbAsyncInit = () => {
        $ngRedux.dispatch(facebookService.init());
    };
    
    if (FB) {
        window.fbAsyncInit();
    }
}