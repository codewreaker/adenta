import * as swc from '@swc/wasm-web';

let initialized = false;

export async function transformCode(code: string): Promise<string> {
  if (!initialized) {
    await swc.default();
    initialized = true;
  }

  try {
    const result = await swc.transform(code, {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
        target: 'es2022',
      },
      module: {
        type: 'es6',
      },
    });

    return result.code;
  } catch (error) {
    console.error('Transform error:', error);
    throw error;
  }
}
