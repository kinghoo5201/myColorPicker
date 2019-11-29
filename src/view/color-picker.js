const { ipcRenderer } = require("electron");

/**============== */
class MouseController {
  constructor(imgUrl, clickFn) {
    this.imgUrl = imgUrl;
    this.clickFn = clickFn;
    this.moverWidth = 150;
    this.moverHeight = 150;
    this.registHandler();
  }

  registHandler = () => {
    this.renderMover();
    window.addEventListener("mousemove", this.moveHandler);
  };

  destroy = () => {
    window.removeEventListener("mousemove", this.moveHandler);
    this.mover.remove();
    this.style.remove();
    this.mover = null;
    this.style = null;
  };

  moveHandler = e => {
    this.mover.style.left = e.clientX - this.moverWidth / 2 + "px";
    this.mover.style.top = e.clientY - this.moverHeight / 2 + "px";
    this.mover.style.backgroundPosition = `-${e.clientX -
      this.moverWidth / 2}px -${e.clientY - this.moverHeight / 2}px`;
  };

  renderMover = () => {
    if (!this.mover && !this.style) {
      this.style = document.createElement("style");
      this.style.innerHTML = `
        #mouse-mover{
            position:fixed;
            z-index:999;
            left:0px;
            top:0px;
            background-repeat:no-repeat;
            width:${this.moverWidth}px;
            height:${this.moverHeight}px;
            background:#ccc;
            border-radius:50%;
            background-image:url(${this.imgUrl});
            box-shadow:0 0 4px rgba(0,0,0,.6);
        }
        `;
      this.mover = document.createElement("div");
      this.mover.id = "mouse-mover";
      document.querySelector("body").appendChild(this.style);
      document.querySelector("body").appendChild(this.mover);
    }
  };
}

/**============== */
let mouseController = null;

function setImg(dataUrl = localStorage.getItem("lastpic")) {
  if (mouseController) {
    mouseController.destroy();
    mouseController = null;
  }
  mouseController = new MouseController(dataUrl);
  localStorage.setItem("lastpic", dataUrl);
  const img = document.createElement("img");
  img.src = dataUrl;
  document.querySelector("#result").innerHTML = "";
  document.querySelector("#result").appendChild(img);
}

setImg();

ipcRenderer.on("data-url", (event, dataUrl) => {
  setImg(dataUrl);
});
