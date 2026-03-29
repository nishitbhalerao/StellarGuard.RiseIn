module.exports = {
  root: true,
  env: { 
    node: true, 
    es2020: true 
  },
  extends: [
    'eslint:recommended'
  ],
  ignorePatterns: ['node_modules'],
  parserOptions: { 
    ecmaVersion: 'latest', 
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    'no-console': 'off', // Allow console in backend
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'brace-style': ['error', '1tbs'],
    'comma-dangle': ['error', 'never'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { 
      avoidEscape: true,
      allowTemplateLiterals: true 
    }],
    'indent': ['error', 2, { 
      SwitchCase: 1 
    }],
    'max-len': ['warn', { 
      code: 100,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true 
    }]
  },
};