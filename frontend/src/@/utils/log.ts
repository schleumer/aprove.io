export default <T>(arg: T): T => {
  console.trace(arg);
  return arg;
};
