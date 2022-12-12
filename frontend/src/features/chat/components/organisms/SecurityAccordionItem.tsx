import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus } from '@prisma/client';
import { LockForm } from 'features/chat/components/molecules/LockForm';
import { UnLockForm } from 'features/chat/components/molecules/UnLockForm';

type Props = {
  status: ChatRoomStatus;
  unLockFunc: () => void;
  lockFunc: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const SecurityAccordionItem: React.FC<Props> = React.memo(
  ({ status, unLockFunc, lockFunc, onChange }) => {
    return (
      <C.AccordionItem>
        <C.AccordionButton>
          <C.Box flex="1" textAlign="left">
            Security
          </C.Box>
          <C.AccordionIcon />
        </C.AccordionButton>
        <C.AccordionPanel pb={4}>
          {/*
        PROTECTEDのとき パスワードの解除
        PUBLICのとき パスワード
        */}
          {status === ChatRoomStatus.PROTECTED && (
            <UnLockForm onClickAction={unLockFunc} />
          )}
          {status === ChatRoomStatus.PUBLIC && (
            <LockForm onClickAction={lockFunc} onChange={onChange} />
          )}
        </C.AccordionPanel>
      </C.AccordionItem>
    );
  }
);
