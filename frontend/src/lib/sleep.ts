export const sleep = async (ms: number): Promise<any> => {
  return await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
