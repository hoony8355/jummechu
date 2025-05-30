// scripts/map.js

const mapPopup = document.getElementById("map-popup");
const mapButton = document.getElementById("show-map-button");

mapButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("위치 정보를 지원하지 않는 브라우저입니다.");
    return;
  }

  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    mapPopup.style.display = "block";
    mapPopup.innerHTML = `
      <iframe
        src="https://map.naver.com/v5/search/맛집?c=${lon},${lat},16,0,0,0,d"
        width="100%"
        height="400"
        frameborder="0"
        style="border:0;"
        allowfullscreen
      ></iframe>
      <button id='close-map'>지도 닫기</button>
    `;

    document.getElementById("close-map").addEventListener("click", () => {
      mapPopup.style.display = "none";
      mapPopup.innerHTML = "";
    });
  }, (err) => {
    alert("위치 정보를 가져오는 데 실패했습니다.");
    console.error(err);
  });
});
