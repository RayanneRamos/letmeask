import moment from 'moment';

function useDistanceInWords() {
  return function (createdAt: number) {
    return moment.duration(moment(new Date()).diff(createdAt)).humanize();
  }
}

export { useDistanceInWords };