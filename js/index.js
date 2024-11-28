var siteName = document.getElementById("bmName");
var siteURL = document.getElementById("bmUrl");
var btnSubmit = document.getElementById("btnSubmit");
var bmWebsites = document.getElementById("bmWebsites");
var deleteBtns;
var openBtns;
var btnClose = document.getElementById("btnClose");
var boxModal = document.querySelector(".box-info");
var bookmarks = [];

if (localStorage.getItem("bookmarksList")) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
  for (var x = 0; x < bookmarks.length; x++) {
    displayBookmark(x);
  }
}

function displayBookmark(indexOfWebsite) {
  var userURL = bookmarks[indexOfWebsite].siteURL;
  var httpsRegex = /^https?:\/\//g;
  if (httpsRegex.test(userURL)) {
    validURL = userURL;
    fixedURL = validURL
      .split("")
      .splice(validURL.match(httpsRegex)[0].length)
      .join("");
  } else {
    var fixedURL = userURL;
    validURL = `https://${userURL}`;
  }
  var newBookmark = `
              <tr>
                <td>${indexOfWebsite + 1}</td>
                <td>${bookmarks[indexOfWebsite].siteName}</td>              
                <td>
                  <button class="btn btn-open" data-index="${indexOfWebsite}">Go To</button>
                </td>
                <td>
                  <button class="btn btn-delete pe-2" data-index="${indexOfWebsite}">Delete</button>
                </td>
            </tr>
            `;
  bmWebsites.innerHTML += newBookmark;

  deleteBtns = document.querySelectorAll(".btn-delete");
  if (deleteBtns) {
    for (var j = 0; j < deleteBtns.length; j++) {
      deleteBtns[j].addEventListener("click", function (e) {
        deleteBookmark(e);
      });
    }
  }

  openBtns = document.querySelectorAll(".btn-open");
  if (openBtns) {
    for (var l = 0; l < openBtns.length; l++) {
      openBtns[l].addEventListener("click", function (e) {
        openSite(e);
      });
    }
  }
}

function clearInput() {
  siteName.value = "";
  siteURL.value = "";
}


function capitalize(str) {
  let strArr = str.split("");
  strArr[0] = strArr[0].toUpperCase();
  return strArr.join("");
}

btnSubmit.addEventListener("click", function () {
  if (
    siteName.classList.contains("is-valid") &&
    siteURL.classList.contains("is-valid")
  ) {
    var bookmark = {
      siteName: capitalize(siteName.value),
      siteURL: siteURL.value,
    };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    displayBookmark(bookmarks.length - 1);
    clearInput();
    siteName.classList.remove("is-valid");
    siteURL.classList.remove("is-valid");
  } else {
    boxModal.classList.remove("d-none");
  }
});

function deleteBookmark(e) {
  bmWebsites.innerHTML = "";
  var deletedIndex = e.target.dataset.index;
  bookmarks.splice(deletedIndex, 1);
  for (var k = 0; k < bookmarks.length; k++) {
    displayBookmark(k);
  }
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
}


function openSite(e) {
  var websiteIndex = e.target.dataset.index;
  var httpsRegex = /^https?:\/\//;
  if (httpsRegex.test(bookmarks[websiteIndex].siteURL)) {
    open(bookmarks[websiteIndex].siteURL);
  } else {
    open(`https://${bookmarks[websiteIndex].siteURL}`);
  }
}


var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;
siteName.addEventListener("input", function () {
  validate(siteName, nameRegex);
});

siteURL.addEventListener("input", function () {
  validate(siteURL, urlRegex);
});

function validate(element, regex) {
  var testRegex = regex;
  if (testRegex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}

function closeModal() {
  boxModal.classList.add("d-none");
}

btnClose.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    closeModal();
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("box-info")) {
    closeModal();
  }
});
