import { proxy } from "valtio";

const state = proxy({
  // if it's currently home page or not
  intro: true,
  color: "purple",
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: "./threejs.png",
  fullDecal: "./threejs.png",
});

export default state;
