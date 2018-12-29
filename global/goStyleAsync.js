export default function go(promise) {
  return promise.then(data => {
     return [null, data];
  })
  .catch(err => [err]);
}