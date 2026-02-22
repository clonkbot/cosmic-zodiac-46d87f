import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: "Cosmic Zodiac" }),
  ],
  transports: {
    [base.id]: http(),
  },
});
