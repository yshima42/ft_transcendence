import * as React from 'react';
import * as C from '@chakra-ui/react';

// 1m, 1h, 1d, 1w, 1M, unlimited
type limit = '1m' | '1h' | '1d' | '1w' | '1M' | 'unlimited';
const limitList: limit[] = ['1m', '1h', '1d', '1w', '1M', 'unlimited'];

type Props = {
  isOpen: boolean;
  onClick: (limit: limit) => void;
  onClose: () => void;
};

export const ChatRoomMemberActionTimeSetModal: React.FC<Props> = React.memo(
  ({ isOpen, onClick, onClose }) => {
    return (
      <C.Modal isOpen={isOpen} onClose={() => onClose()}>
        <C.ModalOverlay />
        <C.ModalContent>
          <C.ModalHeader>Modal Title</C.ModalHeader>
          <C.ModalCloseButton />
          <C.ModalBody>
            <C.Stack direction="column">
              {limitList.map((limit) => (
                <C.Button key={limit} onClick={() => onClick(limit)}>
                  {limit}
                </C.Button>
              ))}
            </C.Stack>
          </C.ModalBody>
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
