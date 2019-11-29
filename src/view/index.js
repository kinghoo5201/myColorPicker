const { ipcRenderer, desktopCapturer } = require("electron");
const _ = require("lodash");

document.querySelector("#get-color").addEventListener("click", () => {
  desktopCapturer
    .getSources({
      types: ["screen"],
      thumbnailSize: {
        height: screen.height,
        width: screen.width
      }
    })
    .then(res => {
      ipcRenderer.send("hide-main");
      const dataUrl = _.get(res, "[0].thumbnail").toDataURL();
      ipcRenderer.send("start-get-color", dataUrl);
    })
    .catch(() => {
      ipcRenderer.send("show-main");
      alert("错误，请重试!");
    });
});
