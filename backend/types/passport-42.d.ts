declare module 'passport-42' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let Strategy: any;
  export interface Profile {
    username: string;
    photos: Array<{ value: string }>;
  }
}
