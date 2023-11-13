// const serverAddress = 'https://127.0.0.1:2000';
let serverAddress = 'https://snipshares.anasouardini.online:2000';
if (
  document.location.host.includes('localhost:') ||
  document.location.host.includes('127.0.0.1:')
) {
  serverAddress = `http://127.0.0.1:2000`;
}

export default { serverAddress };
