import { User } from '@prisma/client';
import { axios } from 'lib/axios';

// curl --location --request POST 'http://localhost:3000/friendships/request' \
// --header 'Content-Type: application/x-www-form-urlencoded' \
// --header 'Cookie: access_token= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxNTE0ZDhiLWU2YWYtNDkwYy1iYzUxLWQwYzdhMzU5YTI2NyIsIm5hbWUiOiJkdW1teTEiLCJpYXQiOjE2NjkxOTIyMjQsImV4cCI6MTY2OTI3ODYyNH0.uy-7gzMA3FwRB3cx3kYsKEik14ZuEMimgsmTgGoo2Q4' \
// --data-urlencode 'peerId=5001da8b-0316-411e-a34f-1db29d4d4c4b'
export const useRequestFriend = (): { requestFriend: (id: string) => void } => {
  async function requestFriend(id: string): Promise<void> {
    try {
      await axios.post<User[]>('/friendships/request', {
        peerId: id,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return { requestFriend };
};
