import { useState, useEffect } from 'react';
import { User } from '@prisma/client';
import { axios } from 'lib/axios';

// curl http://localhost:3000/friendships -H 'Content-Type: application/x-www-form-urlencoded' \
//    -H 'Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxNTE0ZDhiLWU2YWYtNDkwYy1iYzUxLWQwYzdhMzU5YTI2NyIsIm5hbWUiOiJkdW1teTEiLCJpYXQiOjE2NjkxNzM0MDQsImV4cCI6MTY2OTI1OTgwNH0.yQl6MQWLd3LnvLe9_RHemA-6Gs2tlPEZogD5XbwPFAA'

export const useAllFriends = (): { friends: User[] } => {
  const [friends, setFriends] = useState<User[]>([]);

  async function fetchFriends(): Promise<void> {
    const result = await axios.get<User[]>('/friendships');
    setFriends(result.data);
  }

  useEffect(() => {
    fetchFriends().catch(console.error);
  }, []);

  return { friends };
};
