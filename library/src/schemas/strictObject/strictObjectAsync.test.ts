import { describe, expect, test } from 'vitest';
import type { FailureDataset, InferIssue } from '../../types/index.ts';
import {
  expectNoSchemaIssueAsync,
  expectSchemaIssueAsync,
} from '../../vitest/index.ts';
import { any } from '../any/index.ts';
import { exactOptional, exactOptionalAsync } from '../exactOptional/index.ts';
import { nullish, nullishAsync } from '../nullish/index.ts';
import { number } from '../number/index.ts';
import { objectAsync } from '../object/index.ts';
import { optional, optionalAsync } from '../optional/index.ts';
import { string } from '../string/index.ts';
import { unknown } from '../unknown/index.ts';
import {
  strictObjectAsync,
  type StrictObjectSchemaAsync,
} from './strictObjectAsync.ts';
import type { StrictObjectIssue } from './types.ts';

describe('strictObjectAsync', () => {
  describe('should return schema object', () => {
    const entries = { key: string() };
    type Entries = typeof entries;
    const baseSchema: Omit<
      StrictObjectSchemaAsync<Entries, never>,
      'message'
    > = {
      kind: 'schema',
      type: 'strict_object',
      reference: strictObjectAsync,
      expects: 'Object',
      entries,
      async: true,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: StrictObjectSchemaAsync<Entries, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(strictObjectAsync(entries)).toStrictEqual(schema);
      expect(strictObjectAsync(entries, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(strictObjectAsync(entries, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies StrictObjectSchemaAsync<Entries, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(strictObjectAsync(entries, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies StrictObjectSchemaAsync<Entries, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for empty object', async () => {
      await expectNoSchemaIssueAsync(strictObjectAsync({}), [{}]);
    });

    test('for simple object', async () => {
      await expectNoSchemaIssueAsync(
        strictObjectAsync({ key1: string(), key2: number() }),
        [{ key1: 'foo', key2: 123 }]
      );
    });
  });

  describe('should return dataset with issues', () => {
    const schema = strictObjectAsync({}, 'message');
    const baseIssue: Omit<StrictObjectIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'strict_object',
      expected: 'Object',
      message: 'message',
    };

    // Primitive types

    test('for bigints', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [-1n, 0n, 123n]);
    });

    test('for booleans', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [true, false]);
    });

    test('for null', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [null]);
    });

    test('for numbers', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [-1, 0, 123, 45.67]);
    });

    test('for undefined', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [undefined]);
    });

    test('for strings', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, ['', 'abc', '123']);
    });

    test('for symbols', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [
        Symbol(),
        Symbol('foo'),
      ]);
    });

    // Complex types

    // TODO: Enable this test again in case we find a reliable way to check for
    // plain objects
    // test('for arrays', async () => {
    //   await expectSchemaIssueAsync(schema, baseIssue, [[], ['value']]);
    // });

    test('for functions', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function () {},
      ]);
    });
  });

  describe('should return dataset without nested issues', () => {
    test('for simple object', async () => {
      await expectNoSchemaIssueAsync(
        strictObjectAsync({ key1: string(), key2: number() }),
        [{ key1: 'foo', key2: 123 }]
      );
    });

    test('for nested object', async () => {
      await expectNoSchemaIssueAsync(
        strictObjectAsync({ nested: objectAsync({ key: string() }) }),
        [{ nested: { key: 'foo' } }]
      );
    });

    test('for exact optional entry', async () => {
      await expectNoSchemaIssueAsync(
        strictObjectAsync({ key: exactOptional(string()) }),
        [{}, { key: 'foo' }]
      );
      await expectNoSchemaIssueAsync(
        strictObjectAsync({ key: exactOptionalAsync(string()) }),
        [{}, { key: 'foo' }]
      );
    });

    test('for exact optional entry with default', async () => {
      // Sync
      expect(
        await strictObjectAsync({ key: exactOptional(string(), 'foo') })[
          '~run'
        ]({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
      expect(
        await strictObjectAsync({ key: exactOptional(string(), () => 'foo') })[
          '~run'
        ]({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });

      // Async
      expect(
        await strictObjectAsync({ key: exactOptionalAsync(string(), 'foo') })[
          '~run'
        ]({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
      expect(
        await strictObjectAsync({
          key: exactOptionalAsync(string(), () => 'foo'),
        })['~run']({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
    });

    test('for optional entry', async () => {
      await expectNoSchemaIssueAsync(
        strictObjectAsync({ key: optional(string()) }),
        [{}, { key: undefined }, { key: 'foo' }]
      );
      await expectNoSchemaIssueAsync(
        strictObjectAsync({ key: optionalAsync(string()) }),
        [{}, { key: undefined }, { key: 'foo' }]
      );
    });

    test('for optional entry with default', async () => {
      // Sync
      expect(
        await strictObjectAsync({ key: optional(string(), 'foo') })['~run'](
          { value: {} },
          {}
        )
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
      expect(
        await strictObjectAsync({ key: optional(string(), () => 'foo') })[
          '~run'
        ]({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
      expect(
        await strictObjectAsync({
          key: optional(string(), () => undefined),
        })['~run']({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: undefined },
      });

      // Async
      expect(
        await strictObjectAsync({ key: optionalAsync(string(), 'foo') })[
          '~run'
        ]({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
      expect(
        await strictObjectAsync({ key: optionalAsync(string(), () => 'foo') })[
          '~run'
        ]({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
      expect(
        await strictObjectAsync({
          key: optionalAsync(string(), () => undefined),
        })['~run']({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: undefined },
      });
      expect(
        await strictObjectAsync({
          key: optionalAsync(string(), async () => 'foo'),
        })['~run']({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
      expect(
        await strictObjectAsync({
          key: optionalAsync(string(), async () => undefined),
        })['~run']({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: undefined },
      });
    });

    test('for nullish entry', async () => {
      await expectNoSchemaIssueAsync(
        strictObjectAsync({ key: nullish(number()) }),
        [{}, { key: undefined }, { key: null }, { key: 123 }]
      );
      await expectNoSchemaIssueAsync(
        strictObjectAsync({ key: nullishAsync(number()) }),
        [{}, { key: undefined }, { key: null }, { key: 123 }]
      );
    });

    test('for nullish entry with default', async () => {
      // Sync
      expect(
        await strictObjectAsync({ key: nullish(string(), 'foo') })['~run'](
          { value: {} },
          {}
        )
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
      expect(
        await strictObjectAsync({ key: nullish(string(), null) })['~run'](
          { value: {} },
          {}
        )
      ).toStrictEqual({
        typed: true,
        value: { key: null },
      });
      expect(
        await strictObjectAsync({ key: nullish(string(), () => 'foo') })[
          '~run'
        ]({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
      expect(
        await strictObjectAsync({ key: nullish(string(), () => null) })['~run'](
          { value: {} },
          {}
        )
      ).toStrictEqual({
        typed: true,
        value: { key: null },
      });
      expect(
        await strictObjectAsync({ key: nullish(string(), () => undefined) })[
          '~run'
        ]({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: undefined },
      });

      // Async
      expect(
        await strictObjectAsync({ key: nullishAsync(string(), 'foo') })['~run'](
          { value: {} },
          {}
        )
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
      expect(
        await strictObjectAsync({ key: nullishAsync(string(), null) })['~run'](
          { value: {} },
          {}
        )
      ).toStrictEqual({
        typed: true,
        value: { key: null },
      });
      expect(
        await strictObjectAsync({ key: nullishAsync(string(), () => 'foo') })[
          '~run'
        ]({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
      expect(
        await strictObjectAsync({ key: nullishAsync(string(), () => null) })[
          '~run'
        ]({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: null },
      });
      expect(
        await strictObjectAsync({
          key: nullishAsync(string(), () => undefined),
        })['~run']({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: undefined },
      });
      expect(
        await strictObjectAsync({
          key: nullishAsync(string(), async () => 'foo'),
        })['~run']({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: 'foo' },
      });
      expect(
        await strictObjectAsync({
          key: nullishAsync(string(), async () => null),
        })['~run']({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: null },
      });
      expect(
        await strictObjectAsync({
          key: nullishAsync(string(), async () => undefined),
        })['~run']({ value: {} }, {})
      ).toStrictEqual({
        typed: true,
        value: { key: undefined },
      });
    });
  });

  describe('should return dataset with nested issues', () => {
    const schema = strictObjectAsync({
      key1: string(),
      key2: number(),
      nested: strictObjectAsync({ key1: string(), key2: number() }),
    });

    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for missing entries', async () => {
      const input = { key2: 123 };
      expect(await schema['~run']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'strict_object',
            input: undefined,
            expected: '"key1"',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'key',
                input,
                key: 'key1',
                value: undefined,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'strict_object',
            input: undefined,
            expected: '"nested"',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'key',
                input,
                key: 'nested',
                value: undefined,
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for missing nested entries', async () => {
      const input = { key1: 'value', nested: {} };
      expect(await schema['~run']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'strict_object',
            input: undefined,
            expected: '"key2"',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'key',
                input,
                key: 'key2',
                value: undefined,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'strict_object',
            input: undefined,
            expected: '"key1"',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'nested',
                value: {},
              },
              {
                type: 'object',
                origin: 'key',
                input: input.nested,
                key: 'key1',
                value: undefined,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'strict_object',
            input: undefined,
            expected: '"key2"',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'nested',
                value: {},
              },
              {
                type: 'object',
                origin: 'key',
                input: input.nested,
                key: 'key2',
                value: undefined,
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for missing entries with abort early', async () => {
      const input = { key2: 123 };
      expect(
        await schema['~run']({ value: input }, { abortEarly: true })
      ).toStrictEqual({
        typed: false,
        value: {},
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'strict_object',
            input: undefined,
            expected: '"key1"',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'key',
                input,
                key: 'key1',
                value: undefined,
              },
            ],
            abortEarly: true,
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for missing any and unknown entry', async () => {
      const schema = strictObjectAsync({ key1: any(), key2: unknown() });
      expect(await schema['~run']({ value: {} }, {})).toStrictEqual({
        typed: false,
        value: {},
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'strict_object',
            input: undefined,
            expected: '"key1"',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'key',
                input: {},
                key: 'key1',
                value: undefined,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'strict_object',
            input: undefined,
            expected: '"key2"',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'key',
                input: {},
                key: 'key2',
                value: undefined,
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for invalid entries', async () => {
      const input = { key1: false, key2: 123, nested: null };
      expect(await schema['~run']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: false,
            expected: 'string',
            received: 'false',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'key1',
                value: false,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'strict_object',
            input: null,
            expected: 'Object',
            received: 'null',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'nested',
                value: null,
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for invalid nested entries', async () => {
      const input = {
        key1: 'value',
        key2: 'value',
        nested: {
          key1: 123,
          key2: null,
        },
      };
      expect(await schema['~run']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: 'value',
            expected: 'number',
            received: '"value"',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'key2',
                value: input.key2,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: 123,
            expected: 'string',
            received: '123',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'nested',
                value: input.nested,
              },
              {
                type: 'object',
                origin: 'value',
                input: input.nested,
                key: 'key1',
                value: input.nested.key1,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'number',
            input: null,
            expected: 'number',
            received: 'null',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'nested',
                value: input.nested,
              },
              {
                type: 'object',
                origin: 'value',
                input: input.nested,
                key: 'key2',
                value: input.nested.key2,
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for invalid entries with abort early', async () => {
      const input = { key1: false, key2: 123, nested: null };
      expect(
        await schema['~run']({ value: input }, { abortEarly: true })
      ).toStrictEqual({
        typed: false,
        value: {},
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: false,
            expected: 'string',
            received: 'false',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'key1',
                value: false,
              },
            ],
            abortEarly: true,
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for invalid exact optional entry', async () => {
      const schema = strictObjectAsync({
        key1: exactOptional(string()),
        key2: exactOptionalAsync(string()),
      });
      const input = { key1: undefined, key2: undefined };
      expect(await schema['~run']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: undefined,
            expected: 'string',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'key1',
                value: undefined,
              },
            ],
          },
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: undefined,
            expected: 'string',
            received: 'undefined',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'key2',
                value: undefined,
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('for unknown entries', async () => {
      const input = {
        key1: 'foo',
        key2: 123,
        nested: { key1: 'foo', key2: 123 },
        other1: 'foo',
        other2: 123,
      };
      expect(await schema['~run']({ value: input }, {})).toStrictEqual({
        typed: false,
        value: { key1: 'foo', key2: 123, nested: { key1: 'foo', key2: 123 } },
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'strict_object',
            input: 'other1',
            expected: 'never',
            received: '"other1"',
            path: [
              {
                type: 'object',
                origin: 'key',
                input,
                key: 'other1',
                value: input.other1,
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });
  });
});
