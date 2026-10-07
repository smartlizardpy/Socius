

/* ------------------------------------------------------------------- fee --- */

/**
 * What Avenza takes on a booking. Beta does not mean free — the deck used to say
 * "free while in beta", which was a promise nobody made.
 */
export const FEE_RATE = 0.1;

/** The fee on a share, rounded to whole lira. */
export const feeOn = (share: number) => Math.round(share * FEE_RATE);
