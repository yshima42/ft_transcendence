import { memo, FC, useRef, useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';

type Props = {
  socket: Socket;
  isConnected: boolean;
};

// このコンポーネントをprovidersに残すか、componentsに入れるか迷ったが、SocketProviderでしか使わないためprovidersに置いておく
export const InvitationAlert: FC<Props> = memo((props) => {
  const { socket, isConnected } = props;

  // AlertDialogのleastDestructiveRefでエラーが出てたので以下を参考にエラー対応
  // (https://github.com/chakra-ui/chakra-ui/discussions/2936)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { customToast } = useCustomToast();
  const [invitationRoomId, setInvitationRoomId] = useState('');
  const [challengerId, setChallengerId] = useState<string>();
  const { user: challenger } = useProfile(challengerId);
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!isConnected) return;

    socket.on(
      'receive_invitation',
      (message: { invitationRoomId: string; challengerId: string }) => {
        setInvitationRoomId(message.invitationRoomId);
        setChallengerId(message.challengerId);
        onOpen();
      }
    );

    socket.on('close_invitation_alert', () => {
      onClose();
    });

    return () => {
      socket.off('receive_invitation');
      socket.off('close_invitation_alert');
    };
  }, [isConnected, socket, onOpen, onClose]);

  const onClickAccept = () => {
    onClose();
    socket.emit(
      'accept_invitation',
      { invitationRoomId },
      (message: { roomId: string | undefined }) => {
        if (message.roomId === undefined) {
          customToast({ description: 'The opponent canceled the invitation.' });

          return;
        }
        navigate(`/app/game/rooms/${message.roomId}`);
      }
    );
  };

  const onClickDecline = () => {
    onClose();
    socket.emit('decline_invitation', { invitationRoomId });
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClickDecline}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Challenge Match Invitation
          </AlertDialogHeader>

          <AlertDialogBody>
            <strong>{challenger.nickname}</strong> invited to a PongGame. Do you
            accept this Challenge Match?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClickDecline} isDisabled={!isConnected}>
              Decline
            </Button>
            <Button
              colorScheme="green"
              onClick={onClickAccept}
              isDisabled={!isConnected}
              ml={3}
            >
              Accept
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
});
