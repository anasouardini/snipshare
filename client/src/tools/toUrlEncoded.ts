const parseParams = obj =>
  Object.keys(obj)
    .reduce((acc, k) => {
      if (obj[k]) {
        acc.push(`${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`);
      }
      return acc;
    }, [])
    .join('&');

export default function toUrlEncoded(obj) {
  // console.log('obj params', obj);
  const params = parseParams(obj);
  return params ? '?' + params : '';
}
