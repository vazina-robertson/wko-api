// curry a an old function with some initial fixed arg values
module.exports = (oldFn, ...fixedArgs) => {

  // return a new function to call with other args
  return (...newArgs) => {
    const allArgs = [ ...fixedArgs, ...newArgs ];
    oldFn(...allArgs);
  };
};



