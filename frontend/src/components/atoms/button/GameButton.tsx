import { memo, FC, useState, useContext } from 'react';
import {
  Box,
  Button,
  ButtonProps,
  Center,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { BallSpeedType } from 'features/game/utils/gameObjs';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from 'providers/SocketProvider';

type Props = ButtonProps & {
  targetId: string;
};

export const GameButton: FC<Props> = memo((props) => {
  const { targetId, ...buttonProps } = props;

  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('SocketContext undefined');
  }
  const { socket, isConnected } = socketContext;

  const [ballSpeedType, setBallSpeedType] = useState<string>(
    BallSpeedType.NORMAL
  );
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onClickPreferenceOk = () => {
    socket.emit(
      'create_invitation_room',
      { opponentId: targetId, ballSpeedType },
      (message: { invitationRoomId: string }) => {
        navigate(`/app/game/inviting/${message.invitationRoomId}`);
      }
    );
  };

  return (
    <>
      <Button onClick={onOpen} mr={2} size="sm" {...buttonProps}>
        Game
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Flex align="center" justify="center" height="40vh">
              <Box>
                <Heading as="h1" size="lg" textAlign="center" py={4}>
                  Game Preference
                </Heading>
                <Divider />
                <Heading as="h2" size="md" textAlign="center" pt={3}>
                  Ball Speed
                </Heading>
                <Center>
                  <RadioGroup onChange={setBallSpeedType} value={ballSpeedType}>
                    <Stack direction="row">
                      <Radio value={BallSpeedType.SLOW}>Slow</Radio>
                      <Radio value={BallSpeedType.NORMAL}>Normal</Radio>
                      <Radio value={BallSpeedType.FAST}>Fast</Radio>
                    </Stack>
                  </RadioGroup>
                </Center>
                <Stack spacing={4} py={4} px={10} align="center">
                  <Button
                    onClick={onClickPreferenceOk}
                    isDisabled={!isConnected}
                  >
                    OK
                  </Button>
                </Stack>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});
