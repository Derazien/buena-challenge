import type { CodegenConfig } from '@graphql-codegen/cli';

// Use the environment variable if set, otherwise fallback to localhost for local dev
const schemaUrl =
  process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL ||
  'http://localhost:5001/graphql';

const config: CodegenConfig = {
  schema: schemaUrl,
  // Exclude src/graphql/future from codegen so future/planned operations do not break the build
  documents: ['./src/**/*.{ts,tsx}', '!./src/graphql/future/**/*'],
  generates: {
    './src/graphql/generated/index.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
    },
  },
  ignoreNoDocuments: true, // for better experience with the watcher
};

export default config;