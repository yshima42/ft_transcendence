import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// 場所あとで変える
type FollowRelation = {
  following: User[];
  followedBy: User[];
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: User): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { id: { not: user.id } },
    });

    return users;
  }

  async sendFriendRequest(targetId: string, requester: User): Promise<User> {
    const updateUser = await this.prisma.user.update({
      where: { id: requester.id },
      data: {
        updatedAt: new Date(),
        following: {
          connect: [{ id: targetId }],
        },
      },
    });

    return updateUser;
  }

  // followingが存在しないとき、空の配列を返している
  // null返してもいいならそれが楽
  // 今のreturn文の書き方違和感あるのであとで誰かに聞く
  // async findFollowing(id: string): Promise<User[]> {
  //   const users = await this.prisma.user.findUnique({
  //     where: { id },
  //     select: {
  //       following: true,
  //     },
  //   });

  //   return users != null ? users.following : [];
  // }

  async findFollowing(id: string): Promise<User[]> {
    const { following, followedBy } = await this.findFollowRelation(id);
    const idArrayIntersect = this.getIdArraysIntersect(following, followedBy);

    const targetUsers = [...following].filter((val) => {
      return !idArrayIntersect.includes(val.id);
    });
    console.log(targetUsers);

    return targetUsers;
  }

  async findFollowedBy(id: string): Promise<User[]> {
    const { following, followedBy } = await this.findFollowRelation(id);
    const idArrayIntersect = this.getIdArraysIntersect(following, followedBy);
    const targetUsers = [...followedBy].filter((val) => {
      return !idArrayIntersect.includes(val.id);
    });

    return targetUsers;
  }

  // findFollowingと同じく戻り値に違和感
  // async findFollowedBy(id: string): Promise<User[]> {
  //   const users = await this.prisma.user.findUnique({
  //     where: { id },
  //     select: {
  //       followedBy: true,
  //     },
  //   });

  //   return users != null ? users.followedBy : [];
  // }

  getIdArraysIntersect = (following: User[], followedBy: User[]): string[] => {
    const followingIdArray = following.map((itm) => {
      return itm.id;
    });
    const followedByIdArray = followedBy.map((itm) => {
      return itm.id;
    });
    const idArrayIntersect = [...followingIdArray].filter((val) =>
      followedByIdArray.includes(val)
    );

    return idArrayIntersect;
  };

  async findFollowRelation(id: string): Promise<FollowRelation> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        following: true,
        followedBy: true,
      },
    });
    const following = user !== null ? user.following : [];
    const followedBy = user !== null ? user.followedBy : [];

    return { following, followedBy };
  }

  async findFriends(id: string): Promise<User[]> {
    const { following, followedBy } = await this.findFollowRelation(id);
    const idArrayIntersect = this.getIdArraysIntersect(following, followedBy);
    const friends = [...following].filter((val) => {
      return idArrayIntersect.includes(val.id);
    });

    return friends;
  }
}
