import utils from "@/utils";
import { Convert, Deadline, UInt64 } from "tsjs-xpx-chain-sdk";
import multibase from "multibase";
import multihash from "multihashes";
import CID from "multiformats/cid";
import { base32 } from "multiformats/bases/base32";

function concatUint8Arrays(startArr, endArr) {
  const result = new Uint8Array(startArr.length + endArr.length);
  result.set(startArr, 0);
  result.set(endArr, startArr.length);
  return result;
}

export default {
  ...utils,
  getRelativeTimestamp(blockTimestamp) {
    return new Date(
      blockTimestamp.compact() + Deadline.timestampNemesisBlock * 1000
    );
  },
  // CREDITS: https://gist.github.com/lanqy/5193417
  bytesToSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    if (bytes == 0) {
      return `${bytes} ${sizes[0]}`;
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i == 0) {
      return `${bytes} ${sizes[i]}`;
    }

    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
  },
  numberArrayToCompact(numberArray) {
    return new UInt64(numberArray).compact();
  },
  cidToPublicKey(hexString) {
    const cid = multibase.decode(hexString);
    return Convert.uint8ToHex(cid.slice(8));
  },
  publicKeyToCID(hexString) {
    const codecInfo = new Uint8Array(8);
    codecInfo[0] = 1;
    codecInfo[1] = 12;
    codecInfo[3] = 36;
    codecInfo[4] = 8;
    codecInfo[5] = 4;
    codecInfo[6] = 18;
    codecInfo[7] = 32;
    const bytes = concatUint8Arrays(codecInfo, Convert.hexToUint8(hexString));

    const hash = multihash.encode(bytes, 0xc);
    const cid = new CID(1, 0xc, hash, bytes);
    return cid.toString(base32.encoder);
  },
  peerIdToPublicKey(hexString) {
    const peerId = multibase.decode("z" + hexString);
    return Convert.uint8ToHex(peerId.slice(6));
  },
};
