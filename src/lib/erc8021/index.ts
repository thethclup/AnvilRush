import { encodeAbiParameters, parseAbiParameters, Hex } from 'viem';

/**
 * ERC-8021: Cross-DApp Attribution Standard
 * 
 * Implements transaction attribution appending as defined in the standard.
 */

export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "bc_xhh7du90";

/**
 * Appends ERC-8021 attribution data to a transaction's calldata.
 * 
 * @param originalCalldata The original transaction calldata (hex string)
 * @param attributionCode The attribution code to append
 * @param builderCode The builder code to append
 * @returns The new padded calldata with ERC-8021 attribution
 */
export function appendERC8021Attribution(
  originalCalldata: Hex,
  attributionCode: string = ATTRIBUTION_CODE,
  builderCode: string = BUILDER_CODE
): Hex {
  // Simple mock implementation of appending calldata 
  // Normally this would abi.encode the codes and append to the end of the calldata
  // adhering to the standard's layout.
  
  const encodedAttribution = encodeAbiParameters(
    parseAbiParameters('string, string'),
    [attributionCode, builderCode]
  );
  
  // Strip '0x' from encoded attribution and append
  return `${originalCalldata}${encodedAttribution.substring(2)}` as Hex;
}

export function generateGMTransactionData(): Hex {
  // Simple placeholder for a GM transaction with attribution
  const methodId = "0x" + "GM".split('').map(c => c.charCodeAt(0).toString(16)).join('');
  return appendERC8021Attribution(methodId as Hex);
}
