import { FC, memo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Spinner,
  VStack,
  Text,
} from '@chakra-ui/react';
import { useOtpQrcodeUrl } from 'hooks/api';
import { useQRCode } from 'next-qrcode';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
};

export const ModalOtpQrcode: FC<Props> = memo((props) => {
  const { isOpen, onCloseModal } = props;
  const { Canvas } = useQRCode();
  const { qrcodeUrl } = useOtpQrcodeUrl();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>OTP QRcode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack justify="center" align="center">
              <Text fontSize="lg" mb={4}>
                Scan the QR code with Google authenticator.
              </Text>
              {qrcodeUrl === '' ? (
                <Spinner />
              ) : (
                <Canvas
                  text={qrcodeUrl}
                  options={{
                    level: 'M',
                    margin: 3,
                    scale: 4,
                    width: 200,
                    color: {
                      dark: '#010599FF',
                      light: '#FFBF60FF',
                    },
                  }}
                />
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
