import { jest } from "@jest/globals";
import { PostsController } from "../../../src/controllers/posts.controller.js";

// posts.service.js 에서는 아래 5개의 Method만을 사용합니다.
const mockPostsService = {
  findAllPosts: jest.fn(),
  findPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

// postsController의 Service를 Mock Service로 의존성을 주입합니다.
const postsController = new PostsController(mockPostsService);

describe("Posts Controller Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test("getPosts Method by Success", async () => {
    // PostsService의 findAllPosts Method를 실행했을 때 Return 값을 변수로 선언합니다.
    const samplePosts = [
      {
        postId: 2,
        nickname: "Nickname_2",
        title: "Title_2",
        createdAt: new Date("07 October 2011 15:50 UTC"),
        updatedAt: new Date("07 October 2011 15:50 UTC"),
      },
      {
        postId: 1,
        nickname: "Nickname_1",
        title: "Title_1",
        createdAt: new Date("06 October 2011 15:50 UTC"),
        updatedAt: new Date("06 October 2011 15:50 UTC"),
      },
    ];

    // PostsService의 findAllPosts Method를 실행했을 때 Return 값을 samplePosts 변수로 설정합니다.
    mockPostsService.findAllPosts.mockReturnValue(samplePosts);

    // PostsController의 getPosts Method를 실행합니다.
    await postsController.getPosts(mockRequest, mockResponse, mockNext);

    /** PostsController.getPosts 비즈니스 로직 **/
    // 1. PostsService의 findAllPosts Method를 1회 호출합니다.
    // 2. res.status는 1번 호출되고, 200의 값을 반환합니다.
    // 3. findAllPosts Method에서 반환된 posts 변수의 값을 res.json Method를 이용해 { data: posts }의 형식으로 반환합니다.

    // 1. PostsService의 findAllPosts Method를 1회 호출합니다.
    expect(mockPostsService.findAllPosts).toHaveBeenCalledTimes(1);

    // 2. res.status는 1번 호출되고, 200의 값을 반환합니다.
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // 3. findAllPosts Method에서 반환된 posts 변수의 값을 res.json Method를 이용해 { data: posts }의 형식으로 반환합니다.
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: samplePosts,
    });
  });

  test("createPost Method by Success", async () => {
    // PostsController의 createPost Method가 실행되기 위한 Body 입력 인자들입니다.
    const createPostRequestBodyParams = {
      nickname: "Nickname_Success",
      password: "Password_Success",
      title: "Title_Success",
      content: "Content_Success",
    };

    // 입력 인자를 createPost Method를 실행할 때 삽입하지않고, mockRequest의 body를 createPostRequestBodyParams 변수로 설정합니다.
    mockRequest.body = createPostRequestBodyParams;

    // PostsService의 createPost의 Return 값을 설정하는 변수입니다.
    const createPostReturnValue = {
      postId: 99,
      ...createPostRequestBodyParams,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    // PostsService.createPost Method의 Return 값을 createPostReturnValue 변수로 설정합니다.
    mockPostsService.createPost.mockReturnValue(createPostReturnValue);

    // PostsController의 createPost Method를 실행합니다.
    await postsController.createPost(mockRequest, mockResponse, mockNext);

    /** PostsController.createPost 성공 케이스 **/
    // 1. req.body에 들어있는 값을 바탕으로 PostsService.cretePost가 호출됩니다.
    // 2. res.status는 1번 호출되고, 201의 값으로 호출됩니다.
    // 3. PostsService.cretePost에서 반환된 createPostData 변수를 이용해 res.json Method가 호출됩니다.

    // 1. req.body에 들어있는 값을 바탕으로 PostsService.cretePost가 호출됩니다.
    expect(mockPostsService.createPost).toHaveBeenCalledWith(
      createPostRequestBodyParams.nickname,
      createPostRequestBodyParams.password,
      createPostRequestBodyParams.title,
      createPostRequestBodyParams.content
    );
    expect(mockPostsService.createPost).toHaveBeenCalledTimes(1);

    // 2. res.status는 1번 호출되고, 201의 값으로 호출됩니다.
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    // 3. PostsService.cretePost에서 반환된 createPostData 변수를 이용해 res.json Method가 호출됩니다.
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: createPostReturnValue,
    });
  });

  test("createPost Method by Invalid Params Error", async () => {
    // PostsController의 createPost Method가 실행될 때 에러가 발생하는 Body 입력 인자들입니다.
    // 입력 인자를 createPost Method를 실행할 때 삽입하지 않고, mockRequest의 body를 설정합니다.
    mockRequest.body = {
      nickname: "Nickname_InvalidParamsError",
      password: "Password_InvalidParamsError",
    };

    // PostsController의 createPost Method를 실행합니다.
    await postsController.createPost(mockRequest, mockResponse, mockNext);

    /** PostsController.createPost 에러 케이스 by InvalidParamsError **/
    // 1-1. req.body에 들어있는 값을 바탕으로 각 변수들이 객체 구조분해 할당됩니다.
    // 1-2. 필수로 전달되어야 하는 title 값이 존재하지 않아 InvalidParamsError가 발생합니다.
    // 2. try/catch의 next가 호출되며, next의 값은 new Error("Params가 유효하지 않습니다.")의 형식을 가집니다.

    // 2. try/catch의 next가 호출되며, next의 값은 new Error("Params가 유효하지 않습니다.")의 형식을 가집니다.
    expect(mockNext).toHaveBeenCalledWith(new Error("Params가 유효하지 않습니다."));
  });
});
