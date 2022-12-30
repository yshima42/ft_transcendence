import * as React from 'react';
import * as C from '@chakra-ui/react';

export const AlertModal: React.FC<{ error: Error }> = React.memo(
  ({ error }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const onClose = () => setIsOpen(false);

    return (
      <C.Modal isOpen={isOpen} onClose={onClose} isCentered>
        <C.ModalOverlay />
        <C.ModalContent>
          <C.ModalHeader>Error</C.ModalHeader>
          <C.ModalCloseButton />
          <C.ModalBody>{error.message}</C.ModalBody>
          <C.ModalFooter>
            <C.Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </C.Button>
          </C.ModalFooter>
        </C.ModalContent>
      </C.Modal>
    );
  }
);
