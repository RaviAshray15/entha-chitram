function openPopup(title, content) {
  document.getElementById("popupTitle").innerText = title;
  document.getElementById("popupContent").innerHTML = content;
  document.getElementById("popupOverlay").style.display = "block";
  document.getElementById("popupBox").style.display = "block";
}

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
  document.getElementById("popupBox").style.display = "none";
}

function goToSelectDay() {
  window.location.href = "select-day.html";
}

history.pushState(null, "", location.href);
window.onpopstate = function () {
  history.pushState(null, "", location.href);
};
