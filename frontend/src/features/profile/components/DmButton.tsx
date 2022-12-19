import { memo, FC } from 'react';
import { Box, Button } from '@chakra-ui/react';

export const DmButton: FC = memo(() => {
  const onClickDm = () => {
    alert('DM');
  };

  return (
    <Box p={2}>
      <Button size="sm" onClick={onClickDm}>
        DM
      </Button>
    </Box>
  );
});
