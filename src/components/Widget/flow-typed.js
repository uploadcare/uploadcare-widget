/* @flow */
export type File = {
  name: string,
  size: string,
}

export type Props = {
  status: 'ready' | 'started' | 'loaded' | 'error',
  clearable: boolean,
  progressValue?: number,
  file?: File,
  errorMessage?: string,
}
