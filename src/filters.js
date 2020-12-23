import { Deadline, UInt64 } from "tsjs-xpx-chain-sdk";
import multibase from "multibase";
import crypto from "libp2p-crypto";

function idToPublicKey(uint8Arr) {
  const key = crypto.keys.supportedKeys["ed25519"].unmarshalEd25519PublicKey(
    uint8Arr
  );

  return Buffer.from(key._key).toString("hex");
}

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
  numberArrayToCompact(numberArray) {
    return new UInt64(numberArray).compact();
  },
  cidToPublicKey(hexString) {
    const cid = multibase.decode(hexString);
    return idToPublicKey(cid.slice(8));
  },
  peerIdToPublicKey(hexString) {
    const peerId = multibase.decode("z" + hexString);
    return idToPublicKey(peerId.slice(6));
  },
};
