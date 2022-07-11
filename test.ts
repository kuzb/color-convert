import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";

import { hexToRgb, rgbToHex } from "./mod.ts";

Deno.test("[hexToRgb]", () => {
  assertEquals(hexToRgb("#000000"), "rgb(0, 0, 0)");
  assertEquals(hexToRgb("#666"), "rgb(102, 102, 102)");
  assertEquals(hexToRgb("#0f38"), "rgb(0, 255, 51, 0.53)");
  assertEquals(hexToRgb("#3f88c5"), "rgb(63, 136, 197)");
  assertEquals(hexToRgb("#43FF64D9"), "rgb(67, 255, 100, 0.85)");
  assertEquals(hexToRgb("#436affa6"), "rgb(67, 106, 255, 0.65)");
  assertEquals(hexToRgb("#FFB54378"), "rgb(255, 181, 67, 0.47)");
  assertEquals(hexToRgb("#ffffff"), "rgb(255, 255, 255)");
});

Deno.test("[rgbToHex]", () => {
  assertEquals(rgbToHex("rgb(0 0 0)"), "#000000");
  assertEquals(rgbToHex("rgb(102, 102, 102)"), "#666666");
  assertEquals(rgbToHex("rgb(0 255 51 / 0.53)"), "#00ff3388");
  assertEquals(rgbToHex("rgb(63 136 197)"), "#3f88c5");
  assertEquals(rgbToHex("rgb(67, 255, 100, 0.85)"), "#43ff64d9");
  assertEquals(rgbToHex("rgb(67, 106, 255, .65)"), "#436affa6");
  assertEquals(rgbToHex("rgb(67, 106, 255, 65%)"), "#436affa6");
  assertEquals(rgbToHex("rgb(255 181 67 / 0.47)"), "#ffb54378");
  assertEquals(rgbToHex("rgb(255 181 67 / 47%)"), "#ffb54378");
  assertEquals(rgbToHex("rgb(255 255 255)"), "#ffffff");
});
