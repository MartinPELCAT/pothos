import { execute, lexicographicSortSchema, printSchema, subscribe } from 'graphql';
import gql from 'graphql-tag';
import { schema } from './examples/custom-root-names';

describe('custom-root-names example', () => {
  it('generates expected schema', () => {
    expect(printSchema(lexicographicSortSchema(schema))).toMatchInlineSnapshot(`
      "schema {
        query: CustomQuery
        mutation: CustomMutation
        subscription: CustomSubscription
      }

      type CustomMutation {
        hello: String
      }

      type CustomQuery {
        hello: String
        mutation: Mutation
        query: Query
        subscription: Subscription
      }

      type CustomSubscription {
        hello: Int
      }

      type Mutation {
        id: ID
      }

      type Query {
        id: ID
      }

      type Subscription {
        id: ID
      }"
    `);
  });

  it('executes queries', async () => {
    const result = await execute({
      schema,
      document: gql`
      query {
        hello
        query {
            id
          }
          subscription {
            id
          }
          mutation {
            id
          }
        __typename
      }
    `,
    });

    expect(result.data).toMatchInlineSnapshot(`
      {
        "__typename": "CustomQuery",
        "hello": "world",
        "mutation": {
          "id": "123",
        },
        "query": {
          "id": "123",
        },
        "subscription": {
          "id": "123",
        },
      }
    `);
  });

  it('executes mutations', async () => {
    const result = await execute({
      schema,
      document: gql`
        mutation {
          hello
          __typename
        }
      `,
    });

    expect(result.data).toMatchInlineSnapshot(`
      {
        "__typename": "CustomMutation",
        "hello": "world",
      }
    `);
  });

  it('executes subscriptions', async () => {
    const result = await subscribe({
      schema,
      document: gql`
        subscription {
          hello
          __typename
        }
      `,
    });

    const results = [];
    for await (const value of result as AsyncIterable<{ data: { hello: number } }>) {
      results.push(value);
    }

    expect(results).toMatchInlineSnapshot(`
      [
        {
          "data": {
            "__typename": "CustomSubscription",
            "hello": 0,
          },
        },
        {
          "data": {
            "__typename": "CustomSubscription",
            "hello": 1,
          },
        },
        {
          "data": {
            "__typename": "CustomSubscription",
            "hello": 2,
          },
        },
      ]
    `);
  });
});
