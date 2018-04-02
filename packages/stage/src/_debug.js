/* global __DEV__ */
// @flow
export const DEBUG = true && __DEV__;

// eslint-disable-next-line no-console
const debug = DEBUG ? console.log.bind(console) : null;

export default debug;
