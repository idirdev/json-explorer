import { describe, it, expect } from 'vitest';
import { safeJsonParse, getValueType, countNodes, getValuePreview } from '../src/lib/parser';
import { formatJson, minifyJson, sortKeys, sortAndFormat } from '../src/lib/formatter';

describe('safeJsonParse', () => {
  it('should parse valid JSON', () => {
    const result = safeJsonParse('{"name":"test","value":42}');
    expect(result.data).toEqual({ name: 'test', value: 42 });
    expect(result.error).toBeNull();
    expect(result.errorLine).toBeNull();
    expect(result.errorColumn).toBeNull();
  });

  it('should return null data for empty input', () => {
    const result = safeJsonParse('');
    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
  });

  it('should return null data for whitespace-only input', () => {
    const result = safeJsonParse('   ');
    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
  });

  it('should return error details for invalid JSON', () => {
    const result = safeJsonParse('{"name": invalid}');
    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
    expect(typeof result.error).toBe('string');
  });

  it('should parse arrays', () => {
    const result = safeJsonParse('[1, 2, 3]');
    expect(result.data).toEqual([1, 2, 3]);
    expect(result.error).toBeNull();
  });

  it('should parse primitive values', () => {
    expect(safeJsonParse('"hello"').data).toBe('hello');
    expect(safeJsonParse('42').data).toBe(42);
    expect(safeJsonParse('true').data).toBe(true);
    expect(safeJsonParse('null').data).toBeNull();
  });
});

describe('getValueType', () => {
  it('should return "string" for strings', () => {
    expect(getValueType('hello')).toBe('string');
  });

  it('should return "number" for numbers', () => {
    expect(getValueType(42)).toBe('number');
    expect(getValueType(3.14)).toBe('number');
  });

  it('should return "boolean" for booleans', () => {
    expect(getValueType(true)).toBe('boolean');
    expect(getValueType(false)).toBe('boolean');
  });

  it('should return "null" for null', () => {
    expect(getValueType(null)).toBe('null');
  });

  it('should return "array" for arrays', () => {
    expect(getValueType([1, 2, 3])).toBe('array');
    expect(getValueType([])).toBe('array');
  });

  it('should return "object" for objects', () => {
    expect(getValueType({ a: 1 })).toBe('object');
    expect(getValueType({})).toBe('object');
  });
});

describe('countNodes', () => {
  it('should return 1 for primitives', () => {
    expect(countNodes('hello')).toBe(1);
    expect(countNodes(42)).toBe(1);
    expect(countNodes(true)).toBe(1);
    expect(countNodes(null)).toBe(1);
  });

  it('should count object nodes recursively', () => {
    // Object itself counts as 1, plus its values
    expect(countNodes({ a: 1, b: 2 })).toBe(3); // object + 2 values
  });

  it('should count array nodes recursively', () => {
    // Array itself counts as 1, plus its elements
    expect(countNodes([1, 2, 3])).toBe(4); // array + 3 elements
  });

  it('should count nested structures', () => {
    const data = { a: { b: 1 } };
    // outer object (1) + inner object (1) + value 1 (1) = 3
    expect(countNodes(data)).toBe(3);
  });
});

describe('getValuePreview', () => {
  it('should return "null" for null', () => {
    expect(getValuePreview(null)).toBe('null');
  });

  it('should wrap strings in quotes', () => {
    expect(getValuePreview('hello')).toBe('"hello"');
  });

  it('should truncate long strings', () => {
    const longStr = 'a'.repeat(100);
    const result = getValuePreview(longStr, 60);
    expect(result).toContain('...');
    expect(result.startsWith('"')).toBe(true);
  });

  it('should stringify numbers and booleans', () => {
    expect(getValuePreview(42)).toBe('42');
    expect(getValuePreview(true)).toBe('true');
    expect(getValuePreview(false)).toBe('false');
  });

  it('should show array length', () => {
    expect(getValuePreview([1, 2, 3])).toBe('Array(3)');
    expect(getValuePreview([])).toBe('Array(0)');
  });

  it('should show object keys preview', () => {
    const result = getValuePreview({ name: 'test', age: 25 });
    expect(result).toContain('Object');
    expect(result).toContain('name');
    expect(result).toContain('age');
  });

  it('should truncate object keys after 3', () => {
    const result = getValuePreview({ a: 1, b: 2, c: 3, d: 4 });
    expect(result).toContain('...');
  });
});

describe('formatJson', () => {
  it('should format JSON with default indentation', () => {
    const result = formatJson('{"a":1,"b":2}');
    expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it('should format with custom indentation', () => {
    const result = formatJson('{"a":1}', 4);
    expect(result).toBe('{\n    "a": 1\n}');
  });

  it('should return input unchanged for invalid JSON', () => {
    const input = 'not json';
    expect(formatJson(input)).toBe(input);
  });
});

describe('minifyJson', () => {
  it('should remove all whitespace from JSON', () => {
    const input = '{\n  "a": 1,\n  "b": 2\n}';
    expect(minifyJson(input)).toBe('{"a":1,"b":2}');
  });

  it('should return input unchanged for invalid JSON', () => {
    const input = 'not json';
    expect(minifyJson(input)).toBe(input);
  });
});

describe('sortKeys', () => {
  it('should sort object keys alphabetically', () => {
    const result = sortKeys({ c: 3, a: 1, b: 2 });
    expect(Object.keys(result as Record<string, unknown>)).toEqual(['a', 'b', 'c']);
  });

  it('should sort nested object keys', () => {
    const result = sortKeys({ z: { b: 2, a: 1 }, a: 1 }) as Record<string, unknown>;
    expect(Object.keys(result)).toEqual(['a', 'z']);
    expect(Object.keys(result.z as Record<string, unknown>)).toEqual(['a', 'b']);
  });

  it('should handle arrays by sorting objects within them', () => {
    const result = sortKeys([{ b: 1, a: 2 }]) as Array<Record<string, unknown>>;
    expect(Object.keys(result[0])).toEqual(['a', 'b']);
  });

  it('should return primitives unchanged', () => {
    expect(sortKeys(42)).toBe(42);
    expect(sortKeys('hello')).toBe('hello');
    expect(sortKeys(null)).toBeNull();
  });
});

describe('sortAndFormat', () => {
  it('should sort keys and format JSON', () => {
    const result = sortAndFormat('{"c":3,"a":1,"b":2}');
    const parsed = JSON.parse(result);
    expect(Object.keys(parsed)).toEqual(['a', 'b', 'c']);
  });

  it('should return input for invalid JSON', () => {
    expect(sortAndFormat('not json')).toBe('not json');
  });
});
