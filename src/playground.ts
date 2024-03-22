import { Decoder, Stream, Profile, Utils } from "@garmin/fitsdk";
import fs from "fs";
import { recordMesgs } from "./recordMsgs.js";

const fitFilePath =
  "/Users/yvonmomboisse/Downloads/Sortie_v_lo_dans_l_apr_s_midi.fit";

const buf = fs.readFileSync(fitFilePath);
const streamfromFileSync = Stream.fromBuffer(buf);
console.log("isFIT: " + Decoder.isFIT(streamfromFileSync));

const decoder = new Decoder(streamfromFileSync);

const { messages, errors } = decoder.read();

const objectSizeInBytes = Buffer.byteLength(JSON.stringify(messages), "utf8");
console.log(`Size of the decoded FIT file object: ${objectSizeInBytes} bytes`);

// console.log(recordMesgs);

// const fields: Record<number, any> = recordMesgs.fields;

// for (let key in fields) {
//   console.log(fields[key].name);
// }
let messageTypes = Object.keys(messages);

let j: Record<any, any> = {};

messageTypes.forEach((m) => {
  if (messages[m].length < 5) {
    j[m] = messages[m];
  } else {
    j[m] = messages[m].slice(0, 5);
  }
});

const js = JSON.stringify(j);

fs.writeFileSync("./wahoo.json", js);

console.log(Profile);

/*
sessionMesgs = activity summary
*/

// console.log(messages["sessionMesgs"]);

export {};
