window.activeItem = null;

function isolate() {
  window.activeItem = null;
  for (item of root.children) {
    item.className = "";
  }
}

function createItem() {
  let el = document.createElement("div");
  let root = document.getElementById("root");
  root.appendChild(el);

  el.onclick = () => {
    window.activeItem = el;
    if (el.classList.contains("write")) {
      write(el);
    } else {
      read(el);
    }

    isolate();
    el.classList.toggle("write");
  };
  new DragMoveResize(el);
  write(el);
}

function write(el) {
  let size = document.getElementById("size");
  el.style.fontSize = `${size.value}px`;
  let color = document.getElementById("color");
  el.style.color = color.value;
  let back = document.getElementById("back");
  el.style.backgroundColor = back.value;
  let value = document.getElementById("value");
  el.innerText = value.value;
}

function read(el) {
  let size = document.getElementById("size");
  size.value = parseInt(el.style.fontSize.replace("px"));
  let color = document.getElementById("color");
  color.value = el.style.color;
  let back = document.getElementById("back");
  back.value = el.style.backgroundColor;
  let value = document.getElementById("value");
  value.value = el.innerText;
}
