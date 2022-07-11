const HEX_WHOLE = /#[a-f\d]{3,8}/gi;
const HEX_INNER = /#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?/i;
const RGB_WHOLE = /rgba?\((?:\d+[,\s]*){3}(?:[,/\s]+\d?[.]?\d+%?)?\)/g;
const RGB_INNER =
  /rgba?\((\d{1,3})[,\s]+(\d{1,3})[,\s]+(\d{1,3})(?:[,\/\s]+(\d?[.]?\d+%?))?\)/;

export function hexToRgb(match: string): string {
  if (match.length <= 5) {
    match = "#" + match.slice(1).split("").reduce((w, c) => w + c + c, "");
  }

  let [_, r, g, b, a] = HEX_INNER.exec(match)!;

  const rgb = [r, g, b].map((c) => parseInt(c, 16)).join(", ");

  if (a) {
    a = (parseInt(a, 16) / 255).toFixed(2);
  }

  return a ? `rgb(${rgb}, ${a})` : `rgb(${rgb})`;
}

export function rgbToHex(match: string): string {
  let [_, r, g, b, a] = RGB_INNER.exec(match)!;

  const rgb = [r, g, b].map((x) => parseInt(x).toString(16).padStart(2, "0"))
    .join("");

  if (a) {
    a = Math.ceil(parseFloat(a) / (a.at(-1) === "%" ? 100 : 1) * 255).toString(
      16,
    ).padStart(2, "0");
  }

  return `#${rgb}${a ?? ""}`;
}

function replace(
  chunk: string,
  whole: RegExp,
  convert: (s: string) => string,
): string {
  let local = chunk;

  const matches = chunk.match(whole) ?? [];

  for (const match of matches) {
    local = local.replace(match, convert(match));
  }

  return local;
}

function converter(whole: RegExp, convert: (s: string) => string) {
  const stdin = Deno.stdin.readable;
  const stdout = Deno.stdout.writable;

  const textDecorderStream = new TextDecoderStream();
  const textEncoderStream = new TextEncoderStream();

  const convertStream = new TransformStream<string>({
    transform: (chunk, controller) => {
      controller.enqueue(replace(chunk, whole, convert));
    },
  });

  stdin
    .pipeThrough(textDecorderStream)
    .pipeThrough(convertStream)
    .pipeThrough(textEncoderStream)
    .pipeTo(stdout);
}

function printHelp() {
  console.log(`
USAGE:
        color-convert [OPTIONS]

OPTIONS:

        --help
                Print help information

        --hex
                Convert to HEX

        --rgb
                Convert to RGB

`);
}

function printError() {
  console.log(`
USAGE:
        color-convert [OPTIONS]

For more information use --help
`);
}

function main() {
  const command = Deno.args[0];

  if (!command) {
    printError();
    Deno.exit(1);
  }

  switch (command) {
    case "hex":
    case "--hex":
      converter(RGB_WHOLE, rgbToHex);
      break;
    case "rgb":
    case "--rgb":
      converter(HEX_WHOLE, hexToRgb);
      break;
    case "help":
    case "--help":
      printHelp();
      break;
    default:
      printError();
      Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
