/// type declarations for typescript tools using this library

/// ranges.js
// these `string | null` functions appear to think they are returning a boolean
export function validRange(rangeSpec: string): string | null;
export function maxSatisfying(versions: string[], rangeSpec: string): string | null;
export function minSatisfying(versions: string[], rangeSpec: string): string | null;
export function satisfies(version: string, rangeSpec: string): boolean;
export function intersects(range1: string, range2: string): boolean;

/// functions.js
export function major(version: string): number;
export function minor(version: string): number;
export function patch(version: string): number;

// this should also probably be treated as a boolean
export function prerelease(version: string): string[] | null;

export function valid(version: string): string;


/// comparison.js
export function gt(leftVersion: string, rightVersion: string): boolean;
export function gte(leftVersion: string, rightVersion: string): boolean;
export function lt(leftVersion: string, rightVersion: string): boolean;
export function lte(leftVersion: string, rightVersion: string): boolean;
export function eq(leftVersion: string, rightVersion: string): boolean;
export function neq(leftVersion: string, rightVersion: string): boolean;
export function cmp(leftVersion: string, rightVersion: string): boolean;

export function compare(leftVersion: string, rightVersion: string): number;
export function rcompare(leftVersion: string, rightVersion: string): number;
export function compareRanges(leftRange: string, rightRange: string): number;

export function diff(leftVersion: string, rightVersion: string): null
  | 'major' | 'minor' | 'patch'
  | 'premajor' | 'preminor' | 'prepatch'
  | 'prerelease';
