import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus } from '@prisma/client';

type Props = {
  status: ChatRoomStatus;
  unLockFunc: () => void;
  lockFunc: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const SecurityAccordionItem: React.FC<Props> = React.memo(
  ({ status, unLockFunc, lockFunc, onChange }) => {
    return (
      <>
        {/*
        PROTECTEDのとき パスワードの解除
        PUBLICのとき パスワード
        */}
        {status === ChatRoomStatus.PROTECTED && (
          <C.Flex>
            <C.Text mr={5}>Password</C.Text>
            <C.Spacer />
            <C.Flex>
              <C.Text mr={5}>********</C.Text>
              <C.Button colorScheme="blue" mr={5} onClick={unLockFunc}>
                Unlock
              </C.Button>
            </C.Flex>
          </C.Flex>
        )}
        {status === ChatRoomStatus.PUBLIC && (
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
              <C.Button colorScheme="blue" mr={5} onClick={lockFunc}>
                Set
              </C.Button>
            </C.Flex>
          </C.Flex>
        )}
      </>
    );
  }
);
