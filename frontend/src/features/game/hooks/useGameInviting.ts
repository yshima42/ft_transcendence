import { useContext, useEffect, useState } from 'react';
import { useCustomToast } from 'hooks/utils/useCustomToast';
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
  setOpponentId: React.Dispatch<React.SetStateAction<string>>;
  setBallSpeed: React.Dispatch<React.SetStateAction<number>>;
} => {
  const [inviteState, setInviteState] = useState(InviteState.SocketConnecting);
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('SocketContext undefined');
  }
  const { socket, connected } = socketContext;
  const navigate = useNavigate();
  const [opponentId, setOpponentId] = useState('');
  const [ballSpeed, setBallSpeed] = useState(0);
  const { customToast } = useCustomToast();

  // socket イベント
  useEffect(() => {
    socket.on('go_game_room_by_invitation', (roomId: string) => {
      console.log('[Socket Event] go_game_room_by_invitation');
      setInviteState(InviteState.Matched);
      navigate(`/app/games/${roomId}`);
    });

    socket.on('player2_decline_invitation', () => {
      console.log('[Socket Event] go_game_room_by_invitation');
      setInviteState(InviteState.InvitingCancel);
    });

    return () => {
      if (inviteState === InviteState.Inviting) {
        socket.emit('inviting_cancel');
      }
      socket.off('go_game_room_by_invitation');
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
        if (opponentId !== undefined) {
          socket.emit('invitation_match', {
            opponentId,
            ballSpeed,
          });
        }
        break;
      }
      case InviteState.InvitingCancel: {
        console.log('[InviteState] InvitationCancel');
        customToast({
          title: 'Declined',
          description: 'Your Challenge was declined',
          status: 'warning',
        });
        navigate('/app');
        break;
      }
    }
  }, [inviteState, socket, navigate, connected]);

  return {
    inviteState,
    setInviteState,
    setOpponentId,
    setBallSpeed,
  };
};
