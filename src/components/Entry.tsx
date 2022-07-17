import { GetColour } from "Src/Theme";
import "../../resources/app.css";

document.addEventListener("DOMContentLoaded", function () {
  document.body.style.backgroundColor = GetColour("background").Hex;
  document.body.style.margin = "0";
});
