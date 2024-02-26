const address: string = 'http://localhost:3000';

export const getAddress = function (directory: string): string {
  return `${address}${directory}`;
};
