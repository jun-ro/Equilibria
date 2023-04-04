var button = document.querySelector("#submit-button");
var text = document.querySelector("#text");
var title = document.querySelector("#title-input");

function sendForumRequest(title, text) {
  fetch("/createForum", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      text: text,
      title: title,
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
}

button.addEventListener("click", async (e) => {
  e.preventDefault();
  if (text.value !== "" && title.value !== "") {
    sendForumRequest(text.value, title.value)
    var notice = document.createElement("div");
    notice.className = "popup-container";
    notice.innerHTML = `
    <div class="popup">
    <h1 id="notice">Congrats! You've just submitted a form, you'll be returned to the forums page now.</h1>
</div>
    `;
    document.body.appendChild(notice);
    setTimeout(async () => {
      notice.classList.toggle("active");
    }, 100);
    setTimeout(() => {
      window.location.href =
        window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ":" + window.location.port : "") +
        "/forums";
    }, 1000);
  } else {
    console.log("Please actually type something!");
  }

  //sendForumRequest(text.value, title.value)
});
