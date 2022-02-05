// Error codes 
// 1 : invalid password 
// 2 : username does not exist
// 3 : invalid username or password provided 
// 4 : invalid token
// 5 : could not connect to server

//Functions
async function sendMessage(event, data, timeout) {

  return new Promise(function(resolve, reject) {

    var response;

    socket.on(event, (data) => {

      socket.off(event);
      response = true;

      resolve(data);
    });

    socket.emit(event, data);

    setTimeout(function(){
      if (!response) {
        socket.off(event); 
        resolve({error : 5});
      }
    }, timeout);
  });
      
}