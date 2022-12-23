import { useContext, useEffect, useState } from 'react';
import { User } from '@prisma/client';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from 'providers/SocketProvider';

export enum InviteState {
  SocketConnecting = 0,
  GamePreference = 1,
  Inviting = 2,
  InvitingCancel = 3,
  Matched = 4,
}

export const useGameInvitation = (): {
  inviteState: InviteState;
  setInviteState: React.Dispatch<React.SetStateAction<InviteState>>;
  setOpponentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  setBallSpeed: React.Dispatch<React.SetStateAction<number>>;
} => {
  const [inviteState, setInviteState] = useState(InviteState.SocketConnecting);
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('SocketContext undefined');
  }
  const { socket, connected } = socketContext;
  const navigate = useNavigate();
  const [opponentUser, setOpponentUser] = useState<User>();
  // TODO: デフォルト値必要？
  const [ballSpeed, setBallSpeed] = useState(0);

  // socket イベント
  useEffect(() => {
    socket.on('go_game_room', (roomId: string) => {
      console.log('[Socket Event] go_game_room');
      setInviteState(InviteState.Matched);
      navigate(`/app/games/${roomId}`);
    });

    return () => {
      if (inviteState === InviteState.Inviting) {
        socket.emit('inviting_cancel');
      }
      socket.off('go_game_room');
    };
  }, [socket, inviteState, navigate]);

  useEffect(() => {
    switch (inviteState) {
      case InviteState.SocketConnecting: {
        if (connected) {
          console.log('[InviteState] connected');
          setInviteState(InviteState.GamePreference);
        }
        break;
      }
      case InviteState.Inviting: {
        console.log('[InviteState] Inviting');
        if (opponentUser !== undefined) {
          socket.emit('invitation_match', {
            opponentUser,
            ballSpeed,
          });
        }
        break;
      }
      case InviteState.InvitingCancel: {
        console.log('[InviteState] InvitationCancel');
        navigate('/app');
        break;
      }
    }
  }, [inviteState, socket, navigate, connected]);

  return {
    inviteState,
    setInviteState,
    setOpponentUser,
    setBallSpeed,
  };
};
