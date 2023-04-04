var parentNode = document.querySelector(".forum-grids");

var forums_list = [];

const response = await fetch(`/listForums`);
const data = await response.text();
forums_list = JSON.parse(data);

for (let i = 0; i < forums_list.length; i++) {
  var id = forums_list[i];
  fetch(`/getForum/${id}`)
    .then((response) => response.json())
    .then((data) => {
      var text = data.text;
      var title = data.title;
      var forumBlock = document.createElement("div");
      forumBlock.className = "forum-block";
      forumBlock.innerHTML = `
    <div class="profile">
                <img src="/assets/dark_new.png">
            </div>
            <div class="title">
                <h1>${title.toString()}</h1>
                <div class="fake-underline"></div>
            </div>
            <div class="text-area">
                <p>
                ${text.toString()}
                </p>
            </div>
    `;
    parentNode.insertBefore(forumBlock, parentNode.firstChild)
    });
}
