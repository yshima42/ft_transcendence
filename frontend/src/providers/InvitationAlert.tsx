import { memo, FC } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { useProfile } from 'hooks/api';

type Props = {
  isOpen: boolean;
  cancelRef: React.MutableRefObject<null>;
  onClickDecline: () => void;
  onClickAccept: () => void;
  challengerId: string;
};

// このコンポーネントをprovidersに残すか、componentsに入れるか迷ったが、SocketProviderでしか使わないためprovidersに置いておく
export const InvitationAlert: FC<Props> = memo((props) => {
  const { isOpen, cancelRef, onClickDecline, onClickAccept, challengerId } =
    props;
  const { user: challenger } = useProfile(
    challengerId === '' ? 'me' : challengerId
  );

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
            <Button onClick={onClickDecline}>Decline</Button>
            <Button colorScheme="green" onClick={onClickAccept} ml={3}>
              Accept
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
});
