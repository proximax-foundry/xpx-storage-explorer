import CID from "multiformats/cid";
import crypto from "libp2p-crypto";

export default {
  cidToPublicKey(hexString) {
    const cid = CID.parse(hexString);
    const key = crypto.keys.supportedKeys["ed25519"].unmarshalEd25519PublicKey(
      cid.multihash.digest.slice(4)
    );
    return Buffer.from(key._key).toString("hex");
  },
};
