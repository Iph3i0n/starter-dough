import { GetColour } from "Src/Theme";

document.addEventListener("DOMContentLoaded", function () {
  document.body.style.backgroundColor = GetColour("background").Hex;
});
