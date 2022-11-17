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
    <Flex mt={30} flexDir="column" w="100%" alignItems="flex-start">
      <Menu placement="right">
        <Link to={to}>
          <Flex
            p={3}
            borderRadius={8}
            _hover={{ textDecor: 'none', backgroundColor: '#AEC8CA' }}
          >
            <MenuButton
              w="100%"
              _hover={{ textDecor: 'none', backgroundColor: '#AEC8CA' }}
            >
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
