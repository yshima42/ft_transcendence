import { useContext, useEffect, useState } from 'react';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from 'providers/SocketProvider';

export enum InviteState {
  SocketConnecting = 0,
  GamePreference = 1,
  Inviting = 2,
  InvitingCancel = 3,
  InvitingDeclined = 4,
  Matched = 5,
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
  const { socket, isConnected } = socketContext;
  const navigate = useNavigate();
  const [opponentId, setOpponentId] = useState('');
  const [ballSpeed, setBallSpeed] = useState(0);
  const { customToast } = useCustomToast();

  // socket イベント
  useEffect(() => {
    socket.on('go_game_room_by_invitation', (roomId: string) => {
      console.log('[Socket Event] go_game_room_by_invitation');
      setInviteState(InviteState.Matched);
      navigate(`/app/game/rooms/${roomId}`);
    });

    socket.on('player2_decline_invitation', () => {
      console.log('[Socket Event] go_game_room_by_invitation');
      setInviteState(InviteState.InvitingDeclined);
    });

    return () => {
      socket.off('go_game_room_by_invitation');
      socket.off('player2_decline_invitation');
    };
  }, [socket, inviteState, navigate]);

  // 各state のロジック
  useEffect(() => {
    switch (inviteState) {
      case InviteState.SocketConnecting: {
        if (isConnected) {
          setInviteState(InviteState.GamePreference);
        }
        break;
      }
      case InviteState.Inviting: {
        if (opponentId !== undefined) {
          socket.emit('invitation_match', {
            opponentId,
            ballSpeed,
          });
        }
        break;
      }
      case InviteState.InvitingCancel: {
        if (opponentId !== undefined) {
          socket.emit('cancel_invitation', {
            opponentId,
          });
        }
        navigate(-1);
        break;
      }
      case InviteState.InvitingDeclined: {
        customToast({
          title: 'Declined',
          description: 'Your Invitation was declined',
          status: 'warning',
        });
        navigate(-1);
        break;
      }
    }
  }, [inviteState, socket, navigate, isConnected]);

  return {
    inviteState,
    setInviteState,
    setOpponentId,
    setBallSpeed,
  };
};
