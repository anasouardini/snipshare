const sleep = async (time: number) =>
  new Promise((res) => setTimeout(res, time));

export default { sleep };
