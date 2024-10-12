let doSomthing = () => {
  console.log("Execution started...");

  setTimeout(() => {
    console.log("Aync is executing...");
  }, 10000);

  console.log("Execution ended.");
};

// doSomthing();

let resumeCreatePromise = new Promise((resolve, reject) => {
  let result = setTimeout(() => {
    // resolve("Resume was very easy to create by AI.");
    reject("I forgot to create resume, I am sorry!");
  }, 10000);
});

resumeCreatePromise
  .then((success) => {
    console.log(success);
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    console.log("Promised based function was executed.");
  });
