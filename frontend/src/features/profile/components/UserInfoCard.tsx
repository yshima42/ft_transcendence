// import { memo, FC, ChangeEvent, useState } from 'react';
// import {
//   Box,
//   Flex,
//   HStack,
//   Input,
//   Spacer,
//   Stack,
//   Text,
// } from '@chakra-ui/react';
// import { PrimaryButton } from 'components/button/PrimaryButton';

// type Props = {
//   name: string;
//   nickname: string;
// };

// export const ProfileCard: FC<Props> = memo((props) => {
//   const { name, nickname } = props;

//   const [editNickname, setEditNickname] = useState(nickname);

//   const onChangeNickname = (e: ChangeEvent<HTMLInputElement>) =>
//     setEditNickname(e.target.value);

//   const onClickChangeNickname = () => alert('change nickname');

//   return (
//     <Box as={'dl'} bg="gray.100" borderRadius="md" w={500} p={8}>
//       <Stack>
//         <Flex>
//           <Text w={100} as={'dt'} fontSize="lg" fontWeight="bold">
//             Intra Name
//           </Text>
//           <Text as={'dd'} pl={4} align="center">
//             {name}
//           </Text>
//         </Flex>
//         <Flex>
//           <HStack>
//             <Text w={100} as={'dt'} fontSize="lg" fontWeight="bold">
//               Nickname
//             </Text>
//             <Spacer />
//             <Input
//               placeholder={nickname}
//               value={editNickname}
//               onChange={onChangeNickname}
//             />
//             <Spacer />
//             <PrimaryButton onClick={onClickChangeNickname}>edit</PrimaryButton>
//           </HStack>
//         </Flex>
//       </Stack>
//     </Box>
//   );
// });

import { memo, FC } from 'react';
import { Avatar, Button, Flex, Spacer, Tag, Text } from '@chakra-ui/react';
import { useMe } from '../hooks/useMe';

// とりあえず自分用
export const UserInfoCard: FC = memo(() => {
  const { user } = useMe();

  return (
    <Flex
      w="100%"
      h="100%"
      bg="gray.200"
      borderRadius="20px"
      shadow="md"
      pt={2}
      pb={3}
      direction="column"
      align="center"
    >
      <Avatar size="2xl" name={user.nickname} src={user.avatarUrl} />
      <Text fontSize="md" fontWeight="bold" pt="2">
        {user.nickname}
      </Text>
      <Text fontSize="xs" color="gray">
        {user.name}
      </Text>
      <Flex mt="2">
        <Text fontSize="sm">Two-Factor</Text>
        <Tag size="sm" variant="outline" colorScheme="green" ml="2">
          ON
        </Tag>
      </Flex>
      <Spacer />
      <Button size="xs">Edit</Button>
    </Flex>
  );
});
