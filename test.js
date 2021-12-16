const soundElement = document.getElementById("hui");
soundElement.addEventListener("click", audioManager);

function audioManager() {
  let imgSrc = soundElement.getAttribute("src");
  let soundImg = imgSrc == "img/SoundOn.png"? "img/SoundOff.png" : "img/SoundOn.png";
  soundElement.setAttribute("src", soundImg);
}