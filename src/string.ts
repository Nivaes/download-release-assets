export default class String {
  static isNullOrEmpty(value: string | unknown[] | undefined): boolean {
    return !value || value === undefined || value === "" || value.length === 0;
  }
}
