import moment from 'moment';

export const getDatesBetweenDateRange = (startDate, stopDate) => {
  let dateArray = [];
  let currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = moment(currentDate).add(1, 'days')._d;
  }
  return dateArray;
};
