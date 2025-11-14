// contains the effect parameters for each delay effect
// ***** feedback ***** //
export const VIBRATO_FEEDBACK = 0.0;
export const FLANGER_FEEDBACK = 0.7;      // 0.7071
export const CHORUS_FEEDBACK = 0.0;
export const WHITE_CHORUS_FEEDBACK = 0.7; // 0.7071
export const DOUBLING_FEEDBACK = 0.0;
export const ECHO_FEEDBACK = 1.0;  //<=1.0

// ***** feedforward ***** //
export const VIBRATO_FEEDFWD = 1.0;
export const FLANGER_FEEDFWD = 0.7; // 0.7071
export const CHORUS_FEEDFWD = 0.7;  // 0.7071
export const WHITE_CHORUS_FEEDFWD = 1.0; 
export const DOUBLING_FEEDFWD = 0.7; // 0.7071
export const ECHO_FEEDFWD = 1.0;  // <=1.0


// ***** delay range in ms ***** //
export const ECHO_MIN_DELAY = 0.0;
export const ECHO_MAX_DELAY = 2000;    // inf, but setting a limit here
export const FLANGER_MIN_DELAY = 1;
export const FLANGER_MAX_DELAY = 10;
export const VIBRATO_MIN_DELAY = 0.0;
export const VIBRATO_MAX_DELAY = 5;
export const CHORUS_MIN_DELAY = 5;
export const CHORUS_MAX_DELAY = 30;
export const WHITE_CHORUS_MIN_DELAY = 5;
export const WHITE_CHORUS_MAX_DELAY = 30;
export const DOUBLING_MIN_DELAY = 20;
export const DOUBLING_MAX_DELAY = 100;


// phaser special case
export const PHASER_MIN_DEPTH = 100;
export const PHASER_MAX_DEPTH = 500;