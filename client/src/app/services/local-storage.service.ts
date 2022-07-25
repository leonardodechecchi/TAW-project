import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  /**
   *
   * @param key
   * @param value
   */
  setLocal(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   *
   * @param key
   * @param value
   */
  setSession(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  /**
   *
   * @param key
   * @returns
   */
  get(key: string): string | null {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }

  /**
   *
   * @param key
   */
  removeLocal(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   *
   * @param key
   */
  removeSession(key: string): void {
    sessionStorage.removeItem(key);
  }
}
