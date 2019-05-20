import * as isNumber from "is-number";
import FakerData from "./fakerData";

function RepeatHelper() {
  var args = arguments;

  if (args.length > 2) {
    throw new Error(`Expected 0, 1 or 2 arguments, but got ${args.length}`);
  }

  var options = args[args.length - 1];
  var hash = options.hash || {};
  var count = hash.count || args[0] || 0;
  var start = hash.start || 0;
  var step = hash.step || 1;
  var data = { count, start, step };

  if (typeof args[0] === "string" && !isNumber(args[0]) && args[0] !== "") {
    return repeat(data, args[0]);
  }

  if (data.count > 0) {
    return repeatBlock(data, this, options);
  }

  return options.inverse(this);
}

function repeat({ count, start, step }, thisArg) {
  var max = count * step + start;
  var index = start;
  var str = "";

  while (index < max) {
    str += thisArg;
    index += step;
  }
  return str;
}

function repeatBlock({ count, start, step }, thisArg, options) {
  var max = count * step + start;
  var index = start;
  var str = "";
  var faker = new FakerData().getData();

  do {
    var data = {
      faker,
      index,
      count,
      start,
      step,
      first: index === start,
      last: index >= max - step
    };
    var blockParams = [index, data];
    str += options.fn(thisArg, { data, blockParams });
    // result.push(repeatStr.replace(/^\,|\,$/g, ""))
    index += data.step;
    faker = new FakerData().getData();
  } while (index < max);

  return str;
}

export default RepeatHelper;
