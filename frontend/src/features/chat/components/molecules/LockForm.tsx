import * as React from 'react';
import * as C from '@chakra-ui/react';

type Props = {
  onClickAction: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const LockForm: React.FC<Props> = React.memo(
  ({ onClickAction, onChange }) => {
    return (
      <C.Flex>
        <C.Text mr={5}>Password</C.Text>
        <C.Spacer />
        <C.Flex>
          <C.Input
            placeholder="Password"
            variant="filled"
            mr={5}
            onChange={onChange}
          ></C.Input>
          <C.Button colorScheme="blue" mr={5} onClick={onClickAction}>
            Set
          </C.Button>
        </C.Flex>
      </C.Flex>
    );
  }
);
