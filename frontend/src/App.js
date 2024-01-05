import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://react-chatapp-dew9.onrender.com");

const App = () => {

  const [username, setUserName] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [timer, setTimer] = useState(300);

  //useEffect(() => {
  // socket.on("received-message", (message) => {
  //   setMessages([...messages, message]);
  //  });
  //  console.log(messages);
  // }, [messages, socket]);

  useEffect(() => {
    socket.on("received-message", (message) => {
      setMessages([...messages, message]);
    });

    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => Math.max(prevTimer - 1, 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [messages]);

  useEffect(() => {
    if (timer === 0) {
      setChatActive(false);
    }
  }, [timer]);


  const handleSubmit = (e) => {
    e.preventDefault();

    const messageData = {
      message: newMessage,
      user: username,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };


    !newMessage == "" ? socket.emit("send-message", messageData)
      : alert("message can not be empty");

    setNewMessage("");
  }
  return (
    <>
      <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
        {
          chatActive ? (
            <div className="rounded-md w-full md:w-[80vw] lg:w-[40vw] mx-auto p-2">
              <h1 className="text-center font-bold text-xl my-2 uppercase">Chat Box</h1>
              <p className="mt-5 ml-5 px-5 font-semibold border-2 w-fit bg-gray-500 text-white rounded-md outline-none border-none">Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
              <div>
                <div className="overflow-scroll h-[80vh] lg:h-[60vh]">
                  {
                    messages.map((message, index) => {
                      return (
                        <div key={index} className={`flex rounded-md shadow-md my-5 w-fit ${username == message.user && "ml-auto"}`}>
                          <div className="bg-green-500 flex justify-center items-center rounded-l-md">
                            <h3 className="font-bold text-lg px-2">{message.user.charAt(0).toUpperCase()}</h3>
                          </div>

                          <div className="px-2 bg-white rounded-md">
                            <span className="text-sm">{message.user}</span>
                            <h3 className="font-bold">{message.message}</h3>
                            <h3 className="text-xs text-right">{message.time}</h3>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>

                <form className="flex gap-2 md:gap-4 justify-between" onSubmit={handleSubmit}>
                  <input type="text"
                    placeholder="Type Your Message"
                    className="rounded-md border-2 outline-none px-3 py-2 w-full"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)} />

                  <button type="submit" className="px-3 py-2 rounded-md bg-green-800 text-white font-bold">Send</button>
                </form>

              </div>
            </div>
          ) : (
            <div className="w-screen h-screen flex justify-center items-center gap-2">
              <input type="text" name="" id=""
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                className="text-center px-3 py-2 outline-none border-2 rounded-md" />
              <button type="submit"
                onClick={() => !username == "" && setChatActive(true)}
                className="bg-green-700 text-white px-3 py-2 rounded-md font-bold">Start</button>
            </div>
          )}
      </div>

    </>
  )
}

export default App