import "whatwg-fetch";

function getData(uri) {
  return fetch(process.env.API + uri).then(res => res.json());
}

function getAllPath() {
  return fetch(`${process.env.API}/api/mock`).then(res => res.json());
}

function create(uri, data) {
  return fetch(`${process.env.API}/api/mock`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      path: uri,
      data: data
    }),
  }).then(res => res.json());
}

export { getAllPath, create, getData };
