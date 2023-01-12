import { memo, FC } from 'react';
import { Flex, Icon, Menu, MenuButton, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type Props = {
  title: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

export const NavItem: FC<Props> = memo((props) => {
  const { title, icon, to } = props;

  return (
    <Flex mt={5} flexDir="column" w="100%" alignItems="flex-start">
      <Menu placement="right">
        <Link to={to}>
          <Flex
            p={3}
            rounded="full"
            w="160px"
            _hover={{
              textDecor: 'none',
              backgroundColor: 'gray.100',
            }}
          >
            <MenuButton w="100%" data-test={'sidenav-' + title.toLowerCase()}>
              <Flex>
                <Icon as={icon} fontSize="xl" color={'gray.700'} />
                <Text ml={5} display={{ base: 'none', md: 'flex' }}>
                  {title}
                </Text>
              </Flex>
            </MenuButton>
          </Flex>
        </Link>
      </Menu>
    </Flex>
  );
});
