class DragMoveResize {
  constructor(el, { edgeSize = 10, minWidth = 30, minHeight = 30 } = {}) {
    this.el = el;

    this.edgeSize = edgeSize;
    this.minWidth = minWidth;
    this.minHeight = minHeight;

    this.mode = null; // "move" | "resize"
    this.dir = ""; // n s e w ne ...

    this.startX = 0;
    this.startY = 0;
    this.startRect = null;

    this._down = this._down.bind(this);
    this._move = this._move.bind(this);
    this._up = this._up.bind(this);

    el.addEventListener("pointerdown", this._down);
    document.addEventListener("pointermove", this._move);
    document.addEventListener("pointerup", this._up);
    document.addEventListener("pointercancel", this._up);
  }

  _down(e) {
    if (e.button !== 0) return;

    const rect = this.el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.dir = this._getResizeDir(x, y, rect);
    this.mode = this.dir ? "resize" : "move";

    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startRect = rect;

    this.el.setPointerCapture(e.pointerId);
  }

  _move(e) {
    if (!this.mode) return;

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    if (this.mode === "move") {
      this.el.style.left = `${this.startRect.left + dx}px`;
      this.el.style.top = `${this.startRect.top + dy}px`;
      return;
    }

    // resize
    let { left, top, width, height } = this.startRect;

    if (this.dir.includes("e")) width = Math.max(this.minWidth, width + dx);
    if (this.dir.includes("s")) height = Math.max(this.minHeight, height + dy);

    if (this.dir.includes("w")) {
      const newWidth = Math.max(this.minWidth, width - dx);
      left += width - newWidth;
      width = newWidth;
    }

    if (this.dir.includes("n")) {
      const newHeight = Math.max(this.minHeight, height - dy);
      top += height - newHeight;
      height = newHeight;
    }

    this.el.style.left = `${left}px`;
    this.el.style.top = `${top}px`;
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
  }

  _up(e) {
    this.mode = null;
    this.dir = "";
    this.el.releasePointerCapture?.(e.pointerId);
  }

  _getResizeDir(x, y, rect) {
    const edge = this.edgeSize;
    let dir = "";

    if (y < edge) dir += "n";
    else if (y > rect.height - edge) dir += "s";

    if (x < edge) dir += "w";
    else if (x > rect.width - edge) dir += "e";

    return dir;
  }

  destroy() {
    this.el.removeEventListener("pointerdown", this._down);
    document.removeEventListener("pointermove", this._move);
    document.removeEventListener("pointerup", this._up);
    document.removeEventListener("pointercancel", this._up);
  }
}
