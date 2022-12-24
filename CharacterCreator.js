const TILE_W = 16;
const TILE_H = 16;

const LUMIN_BODY_COLOR = "#F6F6F6";
const LUMIN_BODY_SHADING = "#CECECE";
const SHADE_BODY_COLOR = "#303030";
const SHADE_BODY_SHADING = "#1F1F1F";
const NUMBER_COLOR = "#929292";

const DEFAULT_BACKGROUND = "#FFAEC9";

if (OffscreenCanvas === undefined) {
  function OffscreenCanvas(w, h) {
    const result = document.createElement('canvas');
    result.width = w;
    result.height = h;
    return result;
  }
}

const colorCanvas = new OffscreenCanvas(TILE_W, TILE_H);
const colorContext = colorCanvas.getContext("2d");

const scratchCanvas = new OffscreenCanvas(TILE_W, TILE_H);
const scratchContext = scratchCanvas.getContext("2d");

const composeCanvas = new OffscreenCanvas(TILE_W, TILE_H);
const composeContext = composeCanvas.getContext("2d");

const tiles = new Image();
tiles.src = `data:image/png;base64,
iVBORw0KGgoAAAANSUhEUgAAAEAAAAKgAgMAAABW3JPmAAAAIGNIUk0AAHomAACAhAAA+gAAAIDo
AAB1MAAA6mAAADqYAAAXcJy6UTwAAAAJUExURQsWIQAAAP///9KWW4sAAAABdFJOUwBA5thmAAAA
AWJLR0QCZgt8ZAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB+YMFRABMfodipgAAAJuSURB
VGje7VrbroMgEFwSecek/A9N2neayP//yhGYFSuaWptTFTppMmbFy0yXZbUleg3niIxILJzzZJhD
wA9kXhEIJxszSUukmsR+Tzg7s3TOhoFganSn/B5mIt3FO2TOr2Jlf5xKfCIIC6MMB3D/zXJgekhJ
EBAlhwgCYjFQkh+5FvWseiZhwE2dfhBGiMUR3/Fjv3r6NGJjPRXpHOFOfTb5Iu33KzozfgV24gdE
/QosoJ5V/wrsxI+jFNjXaPANKbUUqAr5cqJ15K7b+96+gala8XhEP+738/uxsIinB6u8u2jbGLjd
zN53v4cfkM02jNa7VOrKwYb8gA+iVj8gvxPwwyJg6B2D8lFGPPMhsMIPG3W4K+Q7gwD7MTjGAS60
lq9i4YMpwI8O8+XB88XAoCsbxDaIAibQivyIq6hwGrKngaLgc9p3k6HHVTTX9GLjSFn9f5B4frSw
ofJeewVO3GxuUfut/jRbb6URMWAwRXUasZ/1K9aXWDaZ+wLDOlBiNvYfxfiRdEAYXk0w+/qsxpyP
mD3PIbBhvjg26K0GPhuV+bHiPNMWTqZDotEf59j6/LAs37bQcWcdaNCEYR1m8GDZD4l5Io89Xx7w
4c5+wAdxHfpTGESf5UfmxyGwrX74ysBMLdHNbzD7ohGaGDV613sW/JcfTezomrMZNOdHWAaY205H
tWBqjYgB8Eo/vLnMdKH+01+OOV+SdvTjAj8u7IdGfugK3xfmUOBBLDbqeJ57H4dJ7Z/aHdBMuDYo
sOFAF4OhRzKzI4oG5wGrrkx+hlsk/m/J8OiQeuhsRN3If60uGa//HeahnevGXAr+AOWm0DU82p21
AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTEyLTIwVDIyOjQ5OjMxKzAwOjAwAiUn+wAAACV0RVh0
ZGF0ZTptb2RpZnkAMjAyMi0xMi0yMVQxNjowMToyOCswMDowMJv0N6AAAAAodEVYdGRhdGU6dGlt
ZXN0YW1wADIwMjItMTItMjFUMTY6MDE6NDkrMDA6MDCs+RRMAAAAAElFTkSuQmCC`;

const tileRows = [
  "shade",
  "shade_0",
  "shade_1",
  "shade_2",
  "shade_3",
  "lumin",
  "lumin_0",
  "lumin_1",
  "lumin_2",
  "lumin_3",
  "eyes_normal",
  "eyes_shades",
  "eyes_glasses",
  "hair_0",
  "hair_1",
  "hair_2",
  "hair_3",
  "hair_4",
  "hair_5",
  "hair_6",
  "hair_7",
  "hair_8",
  "hair_9",
  "hair_10",
  "hair_11",
  "hair_12",
  "hair_13",
  "hair_14",
  "hair_15",
  "hair_16",
  "hair_17",
  "hair_18",
  "hair_19",
  "acc_0",
  "acc_1",
  "acc_2",
  "acc_3",
  "acc_flower",
  "acc_hairclip",
  "acc_bow",
  "acc_headband",
  "acc_hat",
];
const tileRowMap = {};
for (let i = 0; i < tileRows.length; i++) {
  tileRowMap[tileRows[i]] = i;
}

function rgb_to_string(c) {
 let retval = '#';
 let format_component = function(component) {
   return ('00' + Math.round(component).toString(16)).substr(-2)
 }
 retval += format_component(c.r);
 retval += format_component(c.g);
 retval += format_component(c.b);
 return retval;
};

//https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
function hsv_to_rgb(h, s, v) {
  h = h / 360;
  let r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function drawCharacter(charOptions) {
  let directionOffset = 0;
  if (charOptions.direction === "left") {
    directionOffset = 2;
  }

  const composeTile = function(rowName, shadow, color, clip) {
    const x = (directionOffset + (shadow ? 1 : 0)) * TILE_W;
    const y = tileRowMap[rowName] * TILE_H;

    if (clip === undefined) {
      clip = {x: 0, y: 0, w: TILE_W, h: TILE_H};
    }

    colorContext.fillStyle = color;
    colorContext.fillRect(0, 0, TILE_W, TILE_H);

    scratchContext.clearRect(0, 0, TILE_W, TILE_H);
    scratchContext.globalCompositeOperation = "source-over";
    scratchContext.drawImage(tiles,
      x + clip.x, y + clip.y, clip.w, clip.h,
          clip.x,     clip.y, clip.w, clip.h);
    scratchContext.globalCompositeOperation = "source-atop";
    scratchContext.drawImage(colorCanvas, 0, 0);

    composeContext.drawImage(scratchCanvas, 0, 0);
  }

  // calculate a bunch of stuff
  const char = charOptions.character;
  const hair = `hair_${charOptions.hair}`;
  let acc = charOptions.accessory;
  switch (charOptions.hair) {
    case "7":
    case "8":
    case "9":
      acc = "none";
      break;
    case "15":
      acc = "0";
      break;
    case "16":
    case "17":
      acc = "1";
      break;
    case "18":
      acc = "2";
      break;
    case "19":
      acc = "3";
      break;
    default:
      acc = charOptions.accessory
      break;
  }

  const hairColor = hsv_to_rgb(charOptions.hairHue, 0.74, 0.87);
  if (char === "shade" || charOptions.greyHair) {
    const hairAvg = (hairColor.r + hairColor.g + hairColor.b) / 3;
    if (charOptions.greyHair) {
      hairColor.r = hairAvg;
      hairColor.g = hairAvg;
      hairColor.b = hairAvg;
    }
    else {
      hairColor.r = (hairAvg + hairColor.r) / 2;
      hairColor.g = (hairAvg + hairColor.g) / 2;
      hairColor.b = (hairAvg + hairColor.b) / 2;
    }
  }
  const hairShading = rgb_to_string({
    r: hairColor.r * 0.75,
    g: hairColor.g * 0.75,
    b: hairColor.b * 0.75,
  });

  let eyeColor;
  if (charOptions.eyes !== "normal") {
    eyeColor = {r: 0x00, g: 0x00, b: 0x00};
  }
  else {
    if (char === "shade") {
      eyeColor = {r: 0xFF, g: 0xFF, b: 0xFF};
      if (charOptions.eyeColor === "red") {
        eyeColor.g = 0xB4;
        eyeColor.b = 0xB4;
      }
      if (charOptions.eyeColor === "green") {
        eyeColor.r = 0xB4;
        eyeColor.b = 0xB4;
      }
      if (charOptions.eyeColor === "blue") {
        eyeColor.r = 0xB4;
        eyeColor.g = 0xB4;
      }
    }
    else {
      eyeColor = {r: 0x00, g: 0x00, b: 0x00};
      if (charOptions.eyeColor === "red") {
        eyeColor.r = 0x32;
      }
      if (charOptions.eyeColor === "green") {
        eyeColor.g = 0x32;
      }
      if (charOptions.eyeColor === "blue") {
        eyeColor.b = 0x32;
      }
    }
  }

  // compose the character
  composeContext.clearRect(0, 0, TILE_W, TILE_H);
  composeTile(hair, true, hairShading, {x: 0, y: 9, w: TILE_W, h: 7});
  composeTile(char, false, char === "lumin" ? LUMIN_BODY_COLOR : SHADE_BODY_COLOR);
  composeTile(char, true, char === "lumin" ? LUMIN_BODY_SHADING : SHADE_BODY_SHADING);
  composeTile(`eyes_${charOptions.eyes}`, false, rgb_to_string(eyeColor));
  composeTile(hair, false, rgb_to_string(hairColor));
  composeTile(hair, true, hairShading, {x: 0, y: 0, w: TILE_W, h: 9});
  if (acc !== "none") {
    let accColor;
    let accColor2 = undefined;
    switch (acc) {
      case "flower":
        if (charOptions.flowerColor === "white") {
          accColor = "#FFFFFF";
          accColor2 = "#FFF200";
        }
        else {
          accColor = "#000000";
          accColor2 = "#BB0000";
        }
        break;
      case "hat":
        accColor = "#68431A";
        accColor2 = "#4A3013";
        break;
      default:
        accColor = rgb_to_string(hsv_to_rgb(charOptions.accessoryHue, 1.0, 0.7333));
        break;
    }
    composeTile(`acc_${acc}`, false, accColor);
    if (accColor2 !== undefined)
      composeTile(`acc_${acc}`, true, accColor2);
  }
  composeTile(`${char}_${charOptions.number}`, false, NUMBER_COLOR);

  // outline
  colorContext.fillStyle = "#000000";
  colorContext.fillRect(0, 0, TILE_W, TILE_H);
  colorContext.globalCompositeOperation = "destination-in";
  colorContext.drawImage(composeCanvas, 0, 0);
  colorContext.globalCompositeOperation = "source-over";

  scratchContext.globalCompositeOperation = "source-over";
  scratchContext.clearRect(0, 0, TILE_W, TILE_H);
  scratchContext.drawImage(colorCanvas,  0,  1);
  scratchContext.drawImage(colorCanvas,  1,  0);
  scratchContext.drawImage(colorCanvas,  0, -1);
  scratchContext.drawImage(colorCanvas, -1,  0);

  composeContext.globalCompositeOperation = "destination-over";
  composeContext.drawImage(scratchCanvas, 0, 0);
  composeContext.globalCompositeOperation = "source-over";

  // output
  const display = document.getElementById("display");
  const displayContext = display.getContext("2d");
  if (charOptions.transparentBackground) {
    displayContext.clearRect(0, 0, TILE_W, TILE_H);
  }
  else {
    displayContext.fillStyle = charOptions.background;
    displayContext.fillRect(0, 0, TILE_W, TILE_H);
  }
  displayContext.drawImage(composeCanvas, 0, 0);
}

const charOptions = {
  character: "lumin",
  direction: "right",
  number: "0",
  eyes: "normal",
  eyeColor: "none",
  hair: "10",
  hairHue: 60,
  greyHair: false,
  accessory: "none",
  accessoryHue: 0,
  flowerColor: "white",
  background: DEFAULT_BACKGROUND,
  transparentBackground: false,
  scale: 16,
  margin: 0,
}

let pushingBackOptions = false;

function pushBackOptions(charOptions) {
  if (pushingBackOptions) {
    return;
  }
  pushingBackOptions = true;
  try {
    document.querySelectorAll('input[type="radio"]').forEach((control)=>{control.checked = false;});

    document.getElementById(`character_${charOptions.character}`).checked = true;
    document.getElementById(`direction_${charOptions.direction}`).checked = true;
    document.getElementById(`number_${charOptions.number}`).checked = true;

    document.getElementById(`eyes_${charOptions.eyes}`).checked = true;
    document.getElementById(`eyeColor_${charOptions.eyeColor}`).checked = true;
    document.getElementById("eyeColor").disabled = charOptions.eyes !== "normal";

    document.getElementById(`hair_${charOptions.hair}`).checked = true;
    document.getElementById("greyHair").checked = charOptions.greyHair;
    document.getElementById("hairHue").value = charOptions.hairHue;
    document.getElementById("hairHue").disabled = charOptions.greyHair;

    document.getElementById(`accessory_${charOptions.accessory}`).checked = true;
    document.getElementById("accessoryHue").value = charOptions.accessoryHue;
    document.getElementById(`flowerColor_${charOptions.flowerColor}`).checked = true;
    if (new Set(["7", "8", "9", "15", "16", "17", "18", "19"]).has(charOptions.hair)) {
      document.getElementById("accessory").disabled = true;
      document.getElementById("accessoryHue").disabled = new Set(["7", "8", "9"]).has(charOptions.hair);
      document.getElementById("flowerColor").disabled = true;
    }
    else {
      document.getElementById("accessory").disabled = false;
      document.getElementById("accessoryHue").disabled = new Set(["flower", "hat"]).has(charOptions.accessory);
      document.getElementById("flowerColor").disabled = charOptions.accessory !== "flower";
    }
    document.getElementById("transparentBackground").checked = charOptions.transparentBackground;
    document.getElementById("background").value = charOptions.background;
    document.getElementById("background").disabled = charOptions.transparentBackground;

    document.getElementById("scale").value = charOptions.scale;
    document.getElementById("margin").value = charOptions.margin;
    const width = TILE_W * charOptions.scale + 2 * charOptions.margin;
    const height = TILE_H * charOptions.scale + 2 * charOptions.margin;
    document.getElementById("size").innerHTML = `${width} x ${height}`;
  }
  finally {
    pushingBackOptions = false;
  }
}

function getHue(value) {
  if (isNaN(value)) {
    value = 60;
  }
  value = Math.round(Number(value));
  if (value < 0 || value >= 360) {
    value = (value % 360 + 360)  % 360;
  }
  return value;
}

function getColor(value) {
  var s = new Option().style;
  s.color = value;

  if(s.color !== value.toLowerCase())
    return DEFAULT_BACKGROUND;
  return value;
}

function getNumberInputValue(input, def) {
  let value = input.value;
  if (isNaN(value)) {
    return def;
  }
  value = Math.round(Number(value));
  if (value < input.min) {
    value = input.min;
  }
  if (value > input.max) {
    value = input.max;
  }
  return value;
}

function optionChanged() {
  if (pushingBackOptions) {
    return;
  }
  charOptions.character = document.querySelector('input[name="character"]:checked').value;
  charOptions.direction = document.querySelector('input[name="direction"]:checked').value;
  charOptions.number = document.querySelector('input[name="number"]:checked').value;
  charOptions.eyes = document.querySelector('input[name="eyes"]:checked').value;
  if (charOptions.eyes === "normal") {
    charOptions.eyeColor = document.querySelector('input[name="eyeColor"]:checked').value;
  }
  charOptions.hair = document.querySelector('input[name="hair"]:checked').value;
  charOptions.greyHair = document.getElementById("greyHair").checked;
  if (!charOptions.greyHair) {
    charOptions.hairHue = getHue(document.getElementById("hairHue").value);
  }
  charOptions.accessory = document.querySelector('input[name="accessory"]:checked').value;
  switch (charOptions.accessory) {
    case "flower":
      charOptions.flowerColor = document.querySelector('input[name="flowerColor"]:checked').value;
      break;
    case "hat":
      //nothing
      break;
    default:
      charOptions.accessoryHue = getHue(document.getElementById("accessoryHue").value);
  }
  charOptions.transparentBackground = document.getElementById("transparentBackground").checked;
  charOptions.background = getColor(document.getElementById("background").value);

  charOptions.scale = getNumberInputValue(document.getElementById("scale"), 16);
  charOptions.margin = getNumberInputValue(document.getElementById("margin"), 0);

  drawCharacter(charOptions);
  pushBackOptions(charOptions);
}

function saveImage() {
  const margin = charOptions.margin;
  const scale = charOptions.scale;
  const width = TILE_W * scale + 2 * margin;
  const height = TILE_H * scale + 2 * margin;

  const imageCanvas = document.createElement('canvas');
  imageCanvas.width = width;
  imageCanvas.height = height;
  const imageContext = imageCanvas.getContext("2d");

  if (charOptions.transparentBackground) {
    imageContext.clearRect(0, 0, width, height);
  }
  else {
    imageContext.fillStyle = charOptions.background;
    imageContext.fillRect(0, 0, width, height);
  }
  const display = document.getElementById("display");
  imageContext.imageSmoothingEnabled = false;
  imageContext.drawImage(display, margin, margin, TILE_W * scale, TILE_H * scale);

  const link = document.createElement('a');
  const now = new Date();
  link.download = `LaS_Character_${now.getTime()}.png`;
  link.href = imageCanvas.toDataURL();
  link.click();
  link.delete;
}

function startup() {
  drawCharacter(charOptions);
  pushBackOptions(charOptions);
}
