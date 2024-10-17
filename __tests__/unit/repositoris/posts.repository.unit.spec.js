import { jest } from '@jest/globals';
import { PostsRepository } from '../../../src/repositories/posts.repository';

// Prisma 클라이언트에서는 아래 5개의 메서드만 사용합니다.
let mockPrisma = {
  posts: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let postsRepository = new PostsRepository(mockPrisma);

describe('Posts Repository Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('findAllPosts Method', async () => {
    // findMany Mock의 Return 값을 "findMany String"으로 설정합니다.
    const mockReturn = 'findMany String';
    mockPrisma.posts.findMany.mockReturnValue(mockReturn);

    // postsRepository의 findAllPosts Method를 호출합니다.
    const posts = await postsRepository.findAllPosts();

    // prisma.posts의 findMany은 1번만 호출 되었습니다.
    expect(postsRepository.prisma.posts.findMany).toHaveBeenCalledTimes(1);

    // mockPrisma의 Return과 출력된 findMany Method의 값이 일치하는지 비교합니다.
    expect(posts).toBe(mockReturn);
  });

  test('createPost Method', async () => {
    // create Mock의 Return 값을 "create Return String"으로 설정합니다.
    const mockReturn = 'create Return String';
    mockPrisma.posts.create.mockReturnValue(mockReturn);

    // createPost Method를 실행하기 위해 필요한 Params 입니다.
    const createPostParams = {
      nickname: 'createPostNickname',
      password: 'createPostPassword',
      title: 'createPostTitle',
      content: 'createPostContent',
    };

    // postsRepository의 createPost Method를 실행합니다.
    const createPostData = await postsRepository.createPost(
      createPostParams.nickname,
      createPostParams.password,
      createPostParams.title,
      createPostParams.content,
    );

    // createPostData는 prisma.posts의 create를 실행한 결과값을 바로 반환한 값인지 테스트합니다.
    expect(createPostData).toBe(mockReturn);

    // postsRepository의 createPost Method를 실행했을 때, prisma.posts의 create를 1번 실행합니다.
    expect(mockPrisma.posts.create).toHaveBeenCalledTimes(1);

    // postsRepository의 createPost Method를 실행했을 때, prisma.posts의 create를 아래와 같은 값으로 호출합니다.
    expect(mockPrisma.posts.create).toHaveBeenCalledWith({
      data: createPostParams,
    });
  });
});