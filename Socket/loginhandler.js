// Functions
function invoke(socket) {
  socket.on("login", (data) => {

    console.log(data);
  });
}

module.exports.invoke = invoke;