import * as React from 'react';
import * as C from '@chakra-ui/react';

type Props = {
  onClickAction: () => void;
};

export const UnLockForm: React.FC<Props> = React.memo(({ onClickAction }) => {
  return (
    <C.Flex>
      <C.Text mr={5}>Password</C.Text>
      <C.Spacer />
      <C.Flex>
        <C.Text mr={5}>********</C.Text>
        <C.Button colorScheme="blue" mr={5} onClick={onClickAction}>
          Unlock
        </C.Button>
      </C.Flex>
    </C.Flex>
  );
});
