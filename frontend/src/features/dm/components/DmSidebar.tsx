import { memo, FC } from 'react';
import {} from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';

export type SideNavigationItem = {
  title: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  iconComponent: React.ReactElement;
};

export const DmSidebar: FC = memo(() => {
  return (
    <>
      <Flex
        pos="sticky"
        h="100vh"
        marginTop="0"
        boxShadow="0 4px 12px 0 rgba(0,0,0,0.15)"
        minW="150px"
        maxW="150px"
        flexDir="column"
        justifyContent="space-between"
      >
        <Flex p="5%" flexDir="column" w="100%" alignItems="flex-start" as="nav">
          aaa
        </Flex>
        <Flex p="5%" flexDir="column" w="100%" mb={4}>
          <Flex mt={4} align="center"></Flex>
        </Flex>
      </Flex>
    </>
  );
});
