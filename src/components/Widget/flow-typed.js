/* @flow */
export type File = {
  name: string,
  size: string,
}

export type Props = {
  status: 'ready' | 'started' | 'loaded' | 'error',
  progressValue?: number,
  file?: File,
  errorMessage?: string,
}
