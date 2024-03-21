const URL = "http://localhost:3001/api/";

function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> }
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
          response
            .json()
            .then((json) => {
              console.log("Json che ritorna in getJson: ", json);
              resolve(json);
            })
            .catch((err) =>
              reject({ error: "Cannot parse server response 1" })
            );
        } else {
          // analyzing the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) =>
              reject({
                error: "Cannot parse server response2: ",
                err: err.message,
              })
            ); // something else
        }
      })
      .catch((err) => reject({ error: "Cannot communicate" })); // connection error
  });
}

async function logIn(credentials) {
  let response = await fetch(URL + "login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail;
  }
}

async function logOut() {
  return getJson(
    fetch(URL + "sessions/current", {
      method: "DELETE",
      credentials: "include", // this parameter specifies that authentication cookie must be forwared
    })
  );
}

async function insertPage(page) {
  let response = await fetch(URL + "addpage", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(page),
  });
  if (response.ok) {
    const result = await response.json();
    return result;
  } else {
    const errDetail = await response.json();
    throw errDetail;
  }
}

async function isLogged() {
  return getJson(fetch(URL + "isLogged", { credentials: "include" }))
    .then((json) => {
      console.log("json in isLogged: ", json);
      return json;
    })
    .catch((err) => {
      throw err;
    });
}

async function getMyPages() {
  return getJson(fetch(URL + "getmypages", { credentials: "include" }))
    .then((pages) => {
      console.log("json in isLogged: ", pages);
      return pages;
    })
    .catch((err) => {
      console.log("Error in API in salita: ", err);
      throw err;
    });
}

async function getPage(pageId) {
  console.log("pageId in API: ", pageId);
  return getJson(fetch(URL + "loadpage/" + pageId, { credentials: "include" }))
    .then((page) => {
      return page;
    })
    .catch((err) => {
      throw err;
    });
}

async function editPage(pageId, page) {
  let response = await fetch(URL + "edit/" + pageId, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(page),
  });
  if (response.ok) {
    const result = await response.json();
    return result;
  } else {
    const errDetail = await response.json();
    throw errDetail;
  }
}

async function deletePage(idPage) {
  return getJson(
    fetch(URL + "pages/" + idPage, {
      method: "DELETE",
      credentials: "include",
    })
  );
}

async function getImages() {
  return getJson(fetch(URL + "images", { credentials: "include" }))
    .then((images) => {
      return images;
    })
    .catch((err) => {
      throw err;
    });
}

async function getPublicPages() {
  return getJson(fetch(URL + "getpublicpages", { credentials: "include" }))
    .then((pages) => {
      console.log("json in isLogged: ", pages);
      return pages;
    })
    .catch((err) => {
      console.log("Error in API in salita: ", err);
      throw err;
    });
}

async function getAllPages() {
  return getJson(fetch(URL + "getallpages", { credentials: "include" }))
    .then((pages) => {
      console.log("json in isLogged: ", pages);
      return pages;
    })
    .catch((err) => {
      console.log("Error in API in salita: ", err);
      throw err;
    });
}

async function showPage(pageId) {
  console.log("pageId in API: ", pageId);
  return getJson(fetch(URL + "showpage/" + pageId, { credentials: "include" }))
    .then((page) => {
      return page;
    })
    .catch((err) => {
      throw err;
    });
}

async function getAuthors() {
  return getJson(fetch(URL + "getauthors", { credentials: "include" }))
    .then((page) => {
      return page;
    })
    .catch((err) => {
      throw err;
    });
}

async function loadCMS() {
  return getJson(fetch(URL + "getcms", { credentials: "include" }))
    .then((pages) => {
      console.log("json in isLogged: ", pages);
      return pages;
    })
    .catch((err) => {
      console.log("Error in API in salita: ", err);
      throw err;
    });
}

async function changeCMS(nameCMS) {
  let response = await fetch(URL + "editcms", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nameCMS),
  });
  if (response.ok) {
    const result = await response.json();
    return result;
  } else {
    const errDetail = await response.json();
    throw errDetail;
  }
}

const API = {
  logIn,
  logOut,
  isLogged,
  insertPage,
  getMyPages,
  getPage,
  editPage,
  getImages,
  getPublicPages,
  getAllPages,
  showPage,
  getAuthors,
  loadCMS,
  changeCMS,
  deletePage,
};
export default API;
