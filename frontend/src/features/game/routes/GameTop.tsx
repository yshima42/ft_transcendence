import { memo, FC, useEffect, useState } from 'react';
import { Box, Button, Center, Stack } from '@chakra-ui/react';
import { SOCKET_URL } from 'config/default';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { JoinRoom } from '../components/JoinRoom';
import { PongGame } from '../components/PongGame';
import GameContext, { GameContextProps } from '../components/gameContext';
import socketService from '../components/socketService';
// import { Game } from './Game';

// const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
//   io(SOCKET_URL);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = io(SOCKET_URL);
// const message = document.getElementById('message');
// const messages = document.getElementById('messages');

export const GameTop: FC = memo(() => {
  // const [inputText, setInputText] = useState('');
  // const [chatLog, setChatLog] = useState<string[]>([]);
  // const [msg, setMsg] = useState('');
  // const [roomID, setRoomID] = useState('');

  // const onClickSubmit = useCallback(() => {
  //   socket.emit('message', inputText);
  // }, [inputText]);

  // // const connectGame = useCallback(() => {
  // //   socket.emit('events', 'hi');
  // // }, []);

  // useEffect(() => {
  //   // socket.on('connect', () => {
  //   //   console.log('connection ID: ', socket.id);
  //   // });

  //   socket.on('update', (message: string) => {
  //     console.log('received: ', message);
  //     setMsg(message);
  //   });
  // }, []);

  // useEffect(() => {
  //   setChatLog([...chatLog, msg]);
  // }, [msg]);

  const [isInRoom, setInRoom] = useState(false);
  const [player, setPlayer] = useState<'one' | 'two'>('one');

  const connectSocket = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const socket = await socketService.connect(SOCKET_URL).catch((err) => {
      console.log('Error: ', err);
    });
  };

  useEffect(() => {
    void connectSocket();
  }, []);

  const gameContextValue: GameContextProps = {
    isInRoom,
    setInRoom,
    player,
    setPlayer,
  };

  return (
    <ContentLayout title="">
      <GameContext.Provider value={gameContextValue}>
        <Center>
          {!isInRoom && <JoinRoom />}
          {isInRoom && <PongGame />}
        </Center>
        <Center>
          <Stack spacing={4} py={4} px={10}>
            <Box w="100%" bg="gray.200">
              Stats Information
            </Box>
            <Link to="matching">
              <Button>Rank Match</Button>
            </Link>
          </Stack>
        </Center>
        {/* <select
        onChange={(event) => {
          setRoomID(event.target.value);
          socket.emit('joinRoom', event.target.value);
          setChatLog([]);
        }}
        value={roomID}
      >
        <option value="">---</option>
        <option value="room1">Room1</option>
        <option value="room2">Room2</option>
      </select>
      <input
        id="inputText"
        type="text"
        value={inputText}
        onChange={(event) => {
          setInputText(event.target.value);
        }}
      />
      <Button onClick={onClickSubmit} type="submit">
        send
      </Button>
      {chatLog.map((message, index) => (
        <p key={index}>{message}</p>
      ))} */}
      </GameContext.Provider>
    </ContentLayout>
  );
});
