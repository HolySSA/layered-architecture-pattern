import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { PostsController } from '../controllers/posts.controller.js';
import { PostsService } from '../services/posts.service.js';
import { PostsRepository } from '../repositories/posts.repository.js';

const router = express.Router();

// 인스턴스 생성.
const postsRepository = new PostsRepository(prisma);
const postsService = new PostsService(postsRepository);
const postsController = new PostsController(postsService);

/** 게시글 조회 API **/
router.get('/', postsController.getPosts);

/** 게시글 상세 조회 API **/
router.get('/:postId', postsController.getPostById);

/** 게시글 작성 API **/
router.post('/', postsController.createPost);

/** 게시글 수정 API **/
router.put('/:postId', postsController.updatePost);

/** 게시글 삭제 API **/
router.delete('/:postId', postsController.deletePost);

export default router;
