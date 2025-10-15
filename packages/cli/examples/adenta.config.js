export default {
  "name": "my-lib",
  "projectType": "library",
  "sourceRoot": "libs/my-lib/src",
  "targets": {
    "build": {
      "executor": "@adenta/cms:payload",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/libs/my-lib",
        "main": "libs/my-lib/src/index.ts",
        "tsConfig": "libs/my-lib/tsconfig.lib.json",
        "assets": ["libs/my-lib/*.md"]
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "options": {
        "lintFilePatterns": ["libs/my-lib/**/*.ts"]
      }
    },
    "test": {
      "executor": "@adenta/cms:ui",
      "outputs": ["{workspaceRoot}/coverage/libs/my-lib"],
      "options": {
        "jestConfig": "libs/my-lib/jest.config.ts",
        "passWithNoTests": true
      }
    },
    "serve": {
      "executor": "@adenta/cms:db",
      "options": {
        "buildTarget": "my-lib:build"
      }
    },
    "type-check": {
      "executor": "nx:run-commands",
      "options": {
        "command": "tsc --noEmit -p libs/my-lib/tsconfig.lib.json"
      }
    },
    "format": {
      "executor": "nx:run-commands",
      "options": {
        "command": "prettier --write \"libs/my-lib/**/*.{ts,js,json,md}\""
      }
    }
  },
  "tags": []
}