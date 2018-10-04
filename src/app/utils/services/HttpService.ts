import { ALL_TOPICS } from './constants/HttpConst';

export async function asyncFetch(url: string, params: any, options: Object) {
  if (url === '') {
    return;
  }
  let newUrl = ALL_TOPICS + url;

  if (params != null) {
    let urlOjb = new URL(newUrl);
    Object.keys(params).forEach((key) => urlOjb.searchParams.append(key, params[key]));
  }
  try {
    let response = await fetch(newUrl, options);
    if (response.ok) {
      return response.json();
    }
  } catch (e) {
    console.log('asyncFetch - Wrappers.js', e);
  }
}

export function webSocket(url: string, params: any) {
  if (url === '') {
    return;
  }
  let newUrl: any = '' + url;

  if (params != null) {
    newUrl = new URL(newUrl);
    Object.keys(params).forEach((key) => newUrl.searchParams.append(key, params[key]));
  }
  return new WebSocket(newUrl);
}
