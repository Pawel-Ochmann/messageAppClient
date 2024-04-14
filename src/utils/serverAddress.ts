const address: string = 'https://message-application.fly.dev';

export const getAddress = function (directory: string): string {
  return `${address}${directory}`;
};
