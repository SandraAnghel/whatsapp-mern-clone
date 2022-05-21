import { useEffect } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';

function App() {

  useEffect(() => {
    const pusher =new Pusher("ce9f230e16f7181327b2", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (data) => {
      alert(JSON.stringify(data));
    });
  }, []);

  return (
    <div className="app">
      <div className='app__body'>
        <Sidebar />
        <Chat />
      </div>

    </div>
  );
}

export default App;
