import moment from 'moment';

export default function eventTime() {
    return (input) => moment(input).format('MMM Do [at] LT')
}