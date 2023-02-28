import { setup } from "@liquality/wallet-sdk";

// require('dotenv').config();

export function setupSDK() {
    setup({
        // alchemyApiKey: process.env.ALCHEMY_API_KEY,
        alchemyApiKey: "z_ewGXAfvU3P3eMmJ0GGWGWim5_4M5dF",
        etherscanApiKey: "YOUR_API_KEY_HERE",
        infuraProjectId: "-",
        pocketNetworkApplicationID: "-",
        quorum: 1,
        slowGasPriceMultiplier: 1,
        averageGasPriceMultiplier: 1.5,
        fastGasPriceMultiplier: 2,
        gasLimitMargin: 2000,
      });
}