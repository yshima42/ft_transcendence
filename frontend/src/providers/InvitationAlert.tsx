import { memo, FC, useRef, useEffect, useState, useCallback } from 'react';
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
import { useMatch, useNavigate } from 'react-router-dom';
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
  const [newInvitationData, setNewInvitationData] = useState<{
    invitationRoomId: string;
    challengerId: string;
  } | null>(null);
  const [invitationRoomId, setInvitationRoomId] = useState<string>();
  const [challengerId, setChallengerId] = useState<string>();
  const { user: challenger } = useProfile(challengerId);
  const cancelRef = useRef(null);
  const isMatchingPage = Boolean(useMatch('/app/game/matching'));
  const isInvitingPage = Boolean(useMatch('/app/game/inviting/:id'));

  // 新しい招待がきたときの処理。
  // receive_invitation で書くと、依存配列により、無駄が多くなるため、分割。
  useEffect(() => {
    if (newInvitationData === null) {
      return;
    }
    if (isOpen || isMatchingPage || isInvitingPage) {
      socket.emit('decline_invitation_for_ready_game', {
        invitationRoomId: newInvitationData.invitationRoomId,
      });
    } else {
      setInvitationRoomId(newInvitationData.invitationRoomId);
      setChallengerId(newInvitationData.challengerId);
      onOpen();
    }
    setNewInvitationData(null);
  }, [
    newInvitationData,
    isOpen,
    onOpen,
    isMatchingPage,
    isInvitingPage,
    invitationRoomId,
    socket,
  ]);

  useEffect(() => {
    if (!isConnected) return;

    socket.on(
      'receive_invitation',
      (message: { invitationRoomId: string; challengerId: string }) => {
        setNewInvitationData(message);
      }
    );

    socket.on('close_invitation_alert', () => {
      onClose();
    });

    return () => {
      socket.off('receive_invitation');
      socket.off('close_invitation_alert');
    };
  }, [isConnected, socket, onClose]);

  const onClickAccept = useCallback(() => {
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
  }, [customToast, invitationRoomId, navigate, onClose, socket]);

  const onClickDecline = useCallback(() => {
    onClose();
    socket.emit('decline_invitation', { invitationRoomId });
  }, [invitationRoomId, onClose, socket]);

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
