import type { CodegenConfig } from '@graphql-codegen/cli';
import fs from 'fs';
import path from 'path';

// Check if we're running in a CI/CD environment (Vercel)
const isCI = process.env.CI || process.env.VERCEL;

// Use a local schema file if in CI, otherwise use the API endpoint
let schemaConfig: string | { [key: string]: any };

if (isCI) {
  console.log('CI environment detected, using local schema');
  
  // Define empty schema to prevent API calls during build
  schemaConfig = {
    typeDefs: `
      type Query {
        _empty: String
      }
    `
  };

  // Create empty generated file to avoid build errors
  const ensureGeneratedExists = () => {
    const dir = './src/graphql/generated';
    const file = path.join(dir, 'index.ts');
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, `
// Auto-generated empty file for CI builds
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [P in K]: Maybe<T[P]> };
      `);
      console.log('Created empty generated file for CI');
    }
  };
  
  // Ensure the file exists for the build
  ensureGeneratedExists();
} else {
  // Use the environment variable if set, otherwise fallback to localhost for local dev
  schemaConfig = process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL || 'http://localhost:5001/graphql';
}

const config: CodegenConfig = {
  schema: schemaConfig,
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