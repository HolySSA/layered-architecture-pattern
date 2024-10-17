import { expect, jest } from "@jest/globals";
import { PostsService } from "../../../src/services/posts.service.js";

// PostsRepository는 아래의 5개 메서드만 지원하고 있습니다.
let mockPostsRepository = {
  findAllPosts: jest.fn(),
  findPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

// postsService의 Repository를 Mock Repository로 의존성을 주입합니다.
let postsService = new PostsService(mockPostsRepository);

describe("Posts Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("findAllPosts Method", async () => {
    const samplePosts = [
      {
        postId: 1,
        nickname: "A",
        title: "Update Title Test",
        createdAt: "2024-10-17T07:32:21.757Z",
        updatedAt: "2024-10-17T07:32:47.031Z",
      },
      {
        postId: 2,
        nickname: "B",
        title: "Title Test",
        createdAt: "2024-10-18T13:29:45.576Z",
        updatedAt: "2024-10-18T13:29:45.576Z",
      },
    ];

    mockPostsRepository.findAllPosts.mockReturnValue(samplePosts);

    const allPosts = await postsService.findAllPosts();

    /** 검증 로직 **/

    // 샘플 데이터와 일치하는가
    expect(allPosts).toEqual(
      samplePosts.sort((a, b) => b.createdAt - a.createdAt)
    );

    // 해당 함수가 한 번 호출되었는가
    expect(mockPostsRepository.findAllPosts).toHaveBeenCalledTimes(1);
  });

  test("deletePost Method By Success", async () => {
    const samplePost = {
      postId: 1,
      nickname: "A",
      password: "1234",
      title: "Update Title Test",
      content: "테스트용 코드입니다.",
      createdAt: "2024-10-17T07:32:21.757Z",
      updatedAt: "2024-10-17T07:32:47.031Z",
    };

    mockPostsRepository.findPostById.mockReturnValue(samplePost);

    // postId, password
    const deletedPost = await postsService.deletePost(1, "1234");

    /** 검증 로직 **/

    // 해당 함수 한 번 호출?
    expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
    // 매개 변수가 일치하는가?
    expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(
      samplePost.postId
    );

    // 해당 함수 한 번 호출?
    expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
    // 매개 변수가 일치하는가?
    expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(
      samplePost.postId,
      samplePost.password
    );

    // 삭제한 샘플 데이터와 일치하는가
    expect(deletedPost).toEqual({
      postId: samplePost.postId,
      nickname: samplePost.nickname,
      title: samplePost.title,
      content: samplePost.content,
      createdAt: samplePost.createdAt,
      updatedAt: samplePost.updatedAt,
    });
  });

  test("deletePost Method By Not Found Post Error", async () => {
    // findPostById Method를 실행했을 때, 아무런 게시글을 찾지 못하도록 수정합니다.
    const samplePost = null;

    // Mock Post Repository의 findPostById Method의 Return 값을 samplePost 변수(null)로 변경합니다.
    mockPostsRepository.findPostById.mockReturnValue(samplePost);

    /** deletePost의 비즈니스 로직**/
    // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
    // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("존재하지 않는 게시글입니다.");

    try {
      await postsService.deletePost(123123, "1234");
    } catch (error) {
      // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
      expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(123123);

      // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("존재하지 않는 게시글입니다.");
      expect(error.message).toEqual("존재하지 않는 게시글입니다.");
    }
  });
});
