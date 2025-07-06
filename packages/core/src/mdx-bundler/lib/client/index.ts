import { getMDXComponent } from 'mdx-bundler/dist/client';
import Failed, { FailedProps } from './Failed.js'


function safeGetMDXComponent(
  ...args: Parameters<typeof getMDXComponent>
) {
  try {
    const res = getMDXComponent(...args);
    return res;
  } catch (error) {
    return (props: FailedProps) => Failed({ ...props, error: error as Error });
  }
}

export {
    safeGetMDXComponent as getMDXComponent
};

