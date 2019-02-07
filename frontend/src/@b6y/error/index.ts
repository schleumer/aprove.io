export interface Error {
  path: string[];
  key: string;
  message: string;
  meta?: any;
}

function fixKey(key: string | null): string {
  if (!key) {
    return "$";
  }

  return key;
}

function fixPath(path: string[]): string[] {
  if (!path || !Array.isArray(path)) {
    return ["$"];
  }

  if (path[0] !== "$") {
    return ["$", ...path];
  }

  return path;
}

export function make(message, key: string = null, path: string[] = [], meta: any = null): Error {
  return { message, key: fixKey(key), path: fixPath(path), meta };
}
