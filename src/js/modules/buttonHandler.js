export class ClickManager {
    constructor() {}
  
    handle(button, func_, ...args) {
      button.addEventListener("click", () => func_(...args));
    }
  }
  