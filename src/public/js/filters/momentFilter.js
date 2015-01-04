app.filter('moment', function () {
    return function (input, momentFn /*, param1, param2, etc... */) {
        var args = Array.prototype.slice.call(arguments, 2),
            momentObj = moment(input);
        return momentObj[momentFn].apply(momentObj, args);
    };
});

app.filter('countdown', function () {
    return function (input) {
        return numeral(input.asSeconds()).format('00:00:00');
//        return [numeral(input.asHours()).format('00'), numeral(input.minutes()).format('00'), numeral(input.seconds()).format('00')].join(':');
    };
});
