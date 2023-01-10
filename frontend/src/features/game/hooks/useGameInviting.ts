import { useContext, useEffect, useState } from 'react';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from 'providers/SocketProvider';

export enum InviteState {
  SocketConnecting = 0,
  Inviting = 1,
  InvitingCancel = 2,
}

export const useGameInvitation = (
  invitationRoomId: string
): {
  inviteState: InviteState;
  setInviteState: React.Dispatch<React.SetStateAction<InviteState>>;
} => {
  const [inviteState, setInviteState] = useState(InviteState.SocketConnecting);
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('SocketContext undefined');
  }
  const { socket, isConnected } = socketContext;
  const navigate = useNavigate();
  const { customToast } = useCustomToast();

  // socket イベント
  useEffect(() => {
    socket.on('invitation_room_error', (message: string) => {
      customToast({ description: message });
      navigate('/app');
    });

    socket.on('go_game_room_by_invitation', (roomId: string) => {
      // console.log('[Socket Event] go_game_room_by_invitation');
      navigate(`/app/game/rooms/${roomId}`);
    });

    socket.on('player2_decline_invitation', () => {
      // console.log('[Socket Event] go_game_room_by_invitation');
      customToast({
        title: 'Declined',
        description: 'Your Invitation was declined',
        status: 'warning',
      });
      navigate(-1);
    });

    return () => {
      socket.emit('leave_invitation_room');
      socket.off('invitation_room_error');
      socket.off('go_game_room_by_invitation');
      socket.off('player2_decline_invitation');
    };
  }, [socket, navigate, customToast]);

  // 各state のロジック
  useEffect(() => {
    switch (inviteState) {
      case InviteState.SocketConnecting: {
        if (isConnected) {
          setInviteState(InviteState.Inviting);
        }
        break;
      }
      case InviteState.Inviting: {
        socket.emit('join_invitation_room', { invitationRoomId });
        break;
      }
      case InviteState.InvitingCancel: {
        navigate(-1);
        break;
      }
    }
  }, [inviteState, socket, navigate, isConnected, invitationRoomId]);

  return { inviteState, setInviteState };
};
