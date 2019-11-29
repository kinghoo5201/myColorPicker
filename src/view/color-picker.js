const { ipcRenderer } = require("electron");

/**=======鼠标监控取色======= */
class MouseController {
  constructor(imgUrl, canvas, clickFn) {
    this.imgUrl = imgUrl;
    this.clickFn = clickFn;
    this.moverWidth = 150;
    this.moverHeight = 150;
    this.zoom = 4;
    this.canMove = true;
    this.canvas = canvas;
    this.timer = null;
    this.registHandler();
  }

  registHandler = () => {
    this.renderMover();
    window.addEventListener("mousemove", this.moveHandler);
    window.addEventListener("click", this.clickHandler);
  };

  destroy = () => {
    window.removeEventListener("click", this.clickHandler);
    window.removeEventListener("mousemove", this.moveHandler);
    this.mover.remove();
    this.style.remove();
    this.colorContainer.remove();
    this.colorContainer = null;
    this.mover = null;
    this.style = null;
    this.color = null;
    this.timer && cancelAnimationFrame(this.timer);
  };

  clickHandler = () => {
    this.clickFn && this.clickFn(this.color);
  };

  moveHandler = e => {
    if (this.canMove) {
      this.canMove = false;
      this.mover.style.left = e.clientX - this.moverWidth / 2 + "px";
      this.mover.style.top = e.clientY - this.moverHeight / 2 + "px";
      const x = -(this.zoom * e.clientX - this.moverWidth / 2);
      const y = -(this.zoom * e.clientY - this.moverHeight / 2);
      this.mover.style.backgroundPosition = `${x}px ${y}px`;
      if (this.canvas) {
        this.color = this.getColor(e.clientX, e.clientY);
        this.colorContainer.innerHTML = `<i style="float:left;display:inline-block;width:20px;height:20px;background:${this.color.hex};margin-right:4px;"></i>hex:${this.color.hex}`;
      }
      this.timer = requestAnimationFrame(() => {
        this.timer && cancelAnimationFrame(this.timer);
        this.canMove = true;
      });
    }
  };

  getColor = (x, y) => {
    let thisContext = this.canvas.getContext("2d");
    let imageData = thisContext.getImageData(x, y, 1, 1);
    let pixel = imageData.data;
    let r = pixel[0];
    let g = pixel[1];
    let b = pixel[2];
    let a = pixel[3] / 255;
    a = Math.round(a * 100) / 100;
    let rHex = r.toString(16);
    r < 16 && (rHex = "0" + rHex);
    let gHex = g.toString(16);
    g < 16 && (gHex = "0" + gHex);
    let bHex = b.toString(16);
    b < 16 && (bHex = "0" + bHex);
    let rgbaColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    let rgbColor = "rgb(" + r + "," + g + "," + b + ")";
    let hexColor = "#" + rHex + gHex + bHex;
    return {
      rgba: rgbaColor,
      rgb: rgbColor,
      hex: hexColor,
      r: r,
      g: g,
      b: b,
      a: a
    };
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
            background-image:url(${this.imgUrl});
            box-shadow:0 0 4px 4px rgba(0,0,0,.6);
            background-size:${screen.width * this.zoom}px ${screen.height *
        this.zoom}px;
        }
        #mouse-mover span{
          display:block;
          width:${this.zoom + 2}px;
          height:${this.zoom + 2}px;
          position:absolute;
          top:50%;
          left:50%;
          margin-left:-${(this.zoom + 2) / 2}px;
          margin-top:-${(this.zoom + 2) / 2}px;
          border:1px solid #ccc;
        }
        #mouse-mover em{
          font-style:normal;
          width:100%;
          display:block;
          text-align:center;
          background-color:rgba(0,0,0,.3);
          color:white;
          font-size:12px;
          height:20px;
          line-height:20px;
        }
        `;
      this.mover = document.createElement("div");
      const inner = document.createElement("span");
      this.colorContainer = document.createElement("em");
      this.colorContainer.innerHTML = `color:#xcvasd`;
      this.mover.appendChild(inner);
      this.mover.appendChild(this.colorContainer);
      this.mover.id = "mouse-mover";
      document.querySelector("body").appendChild(this.style);
      document.querySelector("body").appendChild(this.mover);
    }
  };
}

/**============== */
let mouseController = null;

const clickListener = color => {
  ipcRenderer.send("color-reciever", color);
};

function setImg(dataUrl = localStorage.getItem("lastpic")) {
  if (mouseController) {
    mouseController.destroy();
    mouseController = null;
  }

  localStorage.setItem("lastpic", dataUrl);
  const img = document.createElement("img");
  img.src = dataUrl;
  // document.querySelector("#result").innerHTML = "";
  // document.querySelector("#result").appendChild(img);
  img.onload = () => {
    const canvas = document.querySelector("#canvas");
    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    mouseController = new MouseController(dataUrl, canvas, clickListener);
  };
}

setImg();

ipcRenderer.on("data-url", (event, dataUrl) => {
  setImg(dataUrl);
});
