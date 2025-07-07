import rehypeShikiInstance, { RehypeShikiOptions } from '@shikijs/rehype'

const rehypeShiki = [typeof rehypeShikiInstance,{
  theme: 'nord',
  langs: ['js', 'ts', 'tsx', 'rust', 'c++']
} as RehypeShikiOptions];

export default rehypeShiki;

