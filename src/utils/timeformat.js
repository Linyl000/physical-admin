export function parse(time) {
  let date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth() + 1; // 注意：月份是从0开始的，所以需要+1
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  return  year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}
