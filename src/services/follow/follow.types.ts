// 팔로워/팔로잉 목록 항목
export type FollowUserResponse = {
  userId: number;
  nickname: string;
  image: string | null;
  isFollowing: boolean;
};

// GET /users/{userId}/followers, /users/{userId}/following 공통 응답
export type FollowListResponse = {
  items: FollowUserResponse[];
  nextCursor: string | null;
};

export type GetFollowListParams = {
  cursor?: string;
  limit?: number;
};
