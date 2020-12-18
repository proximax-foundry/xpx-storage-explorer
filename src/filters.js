import { Deadline, UInt64 } from "tsjs-xpx-chain-sdk";
import CID from "multiformats/cid";
import crypto from "libp2p-crypto";

export default {
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
  cidToPublicKey(hexString) {
    const cid = CID.parse(hexString);
    const key = crypto.keys.supportedKeys["ed25519"].unmarshalEd25519PublicKey(
      cid.multihash.digest.slice(4)
    );
    return Buffer.from(key._key).toString("hex");
  },
  numberArrayToCompact(numberArray) {
    return new UInt64(numberArray).compact();
  },
};
