/**
 * Unit Tests for Post Service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createPost,
  toggleLike,
  incrementShares,
  incrementComments,
  updatePostById,
  toggleLikeById,
  incrementSharesById,
  incrementCommentsById,
  addPost,
  filterByCategory,
  getFeaturedPosts,
  getRegularPosts,
  createComment,
  addComment,
  getCommentsForPost,
  toggleCommentVisibility,
  generateShareUrl,
  copyPostUrlToClipboard,
} from './postService';

describe('postService', () => {
  describe('createPost', () => {
    beforeEach(() => {
      vi.spyOn(Date, 'now').mockReturnValue(1234567890123);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create a post with required fields', () => {
      const user = { id: '1', name: 'John Doe' };
      const content = 'Hello, world!';

      const post = createPost({ user, content });

      expect(post.id).toBe('1234567890123');
      expect(post.user).toBe(user);
      expect(post.content).toBe(content);
      expect(post.likes).toBe(0);
      expect(post.comments).toBe(0);
      expect(post.shares).toBe(0);
      expect(post.timestamp).toBe('Just now');
      expect(post.isLiked).toBe(false);
      expect(post.category).toBe('General');
    });

    it('should create a post with an image', () => {
      const user = { id: '1', name: 'John Doe' };
      const content = 'Check out this photo!';
      const image = 'https://example.com/photo.jpg';

      const post = createPost({ user, content, image });

      expect(post.image).toBe(image);
    });

    it('should not include image property when image is null', () => {
      const user = { id: '1', name: 'John Doe' };
      const content = 'No image post';

      const post = createPost({ user, content, image: null });

      expect(post.image).toBeUndefined();
    });

    it('should use custom category when provided', () => {
      const user = { id: '1', name: 'John Doe' };
      const content = 'Tech news';
      const category = 'Technology';

      const post = createPost({ user, content, category });

      expect(post.category).toBe('Technology');
    });

    it('should default to General category when not provided', () => {
      const user = { id: '1', name: 'John Doe' };
      const content = 'General post';

      const post = createPost({ user, content });

      expect(post.category).toBe('General');
    });
  });

  describe('toggleLike', () => {
    it('should toggle like from false to true and increment likes', () => {
      const post = { id: '1', likes: 5, isLiked: false };

      const result = toggleLike(post);

      expect(result.isLiked).toBe(true);
      expect(result.likes).toBe(6);
    });

    it('should toggle like from true to false and decrement likes', () => {
      const post = { id: '1', likes: 5, isLiked: true };

      const result = toggleLike(post);

      expect(result.isLiked).toBe(false);
      expect(result.likes).toBe(4);
    });

    it('should not mutate the original post', () => {
      const post = { id: '1', likes: 5, isLiked: false };

      toggleLike(post);

      expect(post.likes).toBe(5);
      expect(post.isLiked).toBe(false);
    });

    it('should preserve other post properties', () => {
      const post = {
        id: '1',
        likes: 5,
        isLiked: false,
        content: 'Test content',
        user: { name: 'John' },
      };

      const result = toggleLike(post);

      expect(result.id).toBe('1');
      expect(result.content).toBe('Test content');
      expect(result.user).toEqual({ name: 'John' });
    });

    it('should handle zero likes', () => {
      const post = { id: '1', likes: 0, isLiked: false };

      const result = toggleLike(post);

      expect(result.likes).toBe(1);
      expect(result.isLiked).toBe(true);
    });
  });

  describe('incrementShares', () => {
    it('should increment shares by 1', () => {
      const post = { id: '1', shares: 10 };

      const result = incrementShares(post);

      expect(result.shares).toBe(11);
    });

    it('should not mutate the original post', () => {
      const post = { id: '1', shares: 10 };

      incrementShares(post);

      expect(post.shares).toBe(10);
    });

    it('should preserve other post properties', () => {
      const post = { id: '1', shares: 10, content: 'Test', likes: 5 };

      const result = incrementShares(post);

      expect(result.content).toBe('Test');
      expect(result.likes).toBe(5);
    });

    it('should handle zero shares', () => {
      const post = { id: '1', shares: 0 };

      const result = incrementShares(post);

      expect(result.shares).toBe(1);
    });
  });

  describe('incrementComments', () => {
    it('should increment comments by 1', () => {
      const post = { id: '1', comments: 5 };

      const result = incrementComments(post);

      expect(result.comments).toBe(6);
    });

    it('should not mutate the original post', () => {
      const post = { id: '1', comments: 5 };

      incrementComments(post);

      expect(post.comments).toBe(5);
    });

    it('should preserve other post properties', () => {
      const post = { id: '1', comments: 5, content: 'Test', likes: 10 };

      const result = incrementComments(post);

      expect(result.content).toBe('Test');
      expect(result.likes).toBe(10);
    });
  });

  describe('updatePostById', () => {
    it('should update the correct post in array', () => {
      const posts = [
        { id: '1', content: 'Post 1' },
        { id: '2', content: 'Post 2' },
        { id: '3', content: 'Post 3' },
      ];

      const result = updatePostById(posts, '2', (post) => ({
        ...post,
        content: 'Updated Post 2',
      }));

      expect(result[1].content).toBe('Updated Post 2');
    });

    it('should not modify other posts', () => {
      const posts = [
        { id: '1', content: 'Post 1' },
        { id: '2', content: 'Post 2' },
        { id: '3', content: 'Post 3' },
      ];

      const result = updatePostById(posts, '2', (post) => ({
        ...post,
        content: 'Updated',
      }));

      expect(result[0].content).toBe('Post 1');
      expect(result[2].content).toBe('Post 3');
    });

    it('should not mutate original array', () => {
      const posts = [
        { id: '1', content: 'Post 1' },
        { id: '2', content: 'Post 2' },
      ];

      updatePostById(posts, '1', (post) => ({
        ...post,
        content: 'Updated',
      }));

      expect(posts[0].content).toBe('Post 1');
    });

    it('should return unchanged array if post not found', () => {
      const posts = [
        { id: '1', content: 'Post 1' },
        { id: '2', content: 'Post 2' },
      ];

      const result = updatePostById(posts, '999', (post) => ({
        ...post,
        content: 'Updated',
      }));

      expect(result).toEqual(posts);
    });

    it('should handle empty array', () => {
      const result = updatePostById([], '1', (post) => post);

      expect(result).toEqual([]);
    });
  });

  describe('toggleLikeById', () => {
    it('should toggle like on specific post', () => {
      const posts = [
        { id: '1', likes: 5, isLiked: false },
        { id: '2', likes: 10, isLiked: false },
      ];

      const result = toggleLikeById(posts, '1');

      expect(result[0].likes).toBe(6);
      expect(result[0].isLiked).toBe(true);
      expect(result[1].likes).toBe(10);
    });
  });

  describe('incrementSharesById', () => {
    it('should increment shares on specific post', () => {
      const posts = [
        { id: '1', shares: 5 },
        { id: '2', shares: 10 },
      ];

      const result = incrementSharesById(posts, '2');

      expect(result[0].shares).toBe(5);
      expect(result[1].shares).toBe(11);
    });
  });

  describe('incrementCommentsById', () => {
    it('should increment comments on specific post', () => {
      const posts = [
        { id: '1', comments: 3 },
        { id: '2', comments: 7 },
      ];

      const result = incrementCommentsById(posts, '1');

      expect(result[0].comments).toBe(4);
      expect(result[1].comments).toBe(7);
    });
  });

  describe('addPost', () => {
    it('should add new post at the beginning of the array', () => {
      const posts = [
        { id: '1', content: 'Old post' },
        { id: '2', content: 'Older post' },
      ];
      const newPost = { id: '3', content: 'New post' };

      const result = addPost(posts, newPost);

      expect(result[0]).toBe(newPost);
      expect(result.length).toBe(3);
    });

    it('should not mutate original array', () => {
      const posts = [{ id: '1', content: 'Post 1' }];
      const newPost = { id: '2', content: 'Post 2' };

      addPost(posts, newPost);

      expect(posts.length).toBe(1);
    });

    it('should work with empty array', () => {
      const newPost = { id: '1', content: 'First post' };

      const result = addPost([], newPost);

      expect(result).toEqual([newPost]);
    });
  });

  describe('filterByCategory', () => {
    const categories = [
      { id: 'tech', name: 'Technology' },
      { id: 'lifestyle', name: 'Lifestyle' },
      { id: 'news', name: 'News' },
    ];

    const posts = [
      { id: '1', category: 'Technology' },
      { id: '2', category: 'Lifestyle' },
      { id: '3', category: 'Technology' },
      { id: '4', category: 'News' },
    ];

    it('should filter posts by category id', () => {
      const result = filterByCategory(posts, 'tech', categories);

      expect(result.length).toBe(2);
      expect(result.every((p) => p.category === 'Technology')).toBe(true);
    });

    it('should return all posts when categoryId is null', () => {
      const result = filterByCategory(posts, null, categories);

      expect(result).toEqual(posts);
    });

    it('should return all posts when categoryId is undefined', () => {
      const result = filterByCategory(posts, undefined, categories);

      expect(result).toEqual(posts);
    });

    it('should return all posts when category not found', () => {
      const result = filterByCategory(posts, 'nonexistent', categories);

      expect(result).toEqual(posts);
    });

    it('should return empty array when no posts match category', () => {
      const postsWithoutNews = posts.filter((p) => p.category !== 'News');
      const result = filterByCategory(postsWithoutNews, 'news', categories);

      expect(result).toEqual([]);
    });
  });

  describe('getFeaturedPosts', () => {
    it('should return popular posts up to limit', () => {
      const posts = [
        { id: '1', isPopular: true },
        { id: '2', isPopular: false },
        { id: '3', isPopular: true },
        { id: '4', isPopular: true },
      ];

      const result = getFeaturedPosts(posts, 2);

      expect(result.length).toBe(2);
      expect(result.every((p) => p.isPopular)).toBe(true);
    });

    it('should default to limit of 2', () => {
      const posts = [
        { id: '1', isPopular: true },
        { id: '2', isPopular: true },
        { id: '3', isPopular: true },
      ];

      const result = getFeaturedPosts(posts);

      expect(result.length).toBe(2);
    });

    it('should return all popular posts if less than limit', () => {
      const posts = [
        { id: '1', isPopular: true },
        { id: '2', isPopular: false },
      ];

      const result = getFeaturedPosts(posts, 5);

      expect(result.length).toBe(1);
    });

    it('should return empty array if no popular posts', () => {
      const posts = [
        { id: '1', isPopular: false },
        { id: '2', isPopular: false },
      ];

      const result = getFeaturedPosts(posts);

      expect(result).toEqual([]);
    });
  });

  describe('getRegularPosts', () => {
    it('should exclude featured posts', () => {
      const posts = [
        { id: '1', content: 'Post 1' },
        { id: '2', content: 'Post 2' },
        { id: '3', content: 'Post 3' },
      ];
      const featuredPosts = [{ id: '1', content: 'Post 1' }];

      const result = getRegularPosts(posts, featuredPosts);

      expect(result.length).toBe(2);
      expect(result.find((p) => p.id === '1')).toBeUndefined();
    });

    it('should return all posts if no featured posts', () => {
      const posts = [
        { id: '1', content: 'Post 1' },
        { id: '2', content: 'Post 2' },
      ];

      const result = getRegularPosts(posts, []);

      expect(result).toEqual(posts);
    });

    it('should return empty array if all posts are featured', () => {
      const posts = [
        { id: '1', content: 'Post 1' },
        { id: '2', content: 'Post 2' },
      ];

      const result = getRegularPosts(posts, posts);

      expect(result).toEqual([]);
    });
  });

  describe('createComment', () => {
    beforeEach(() => {
      vi.spyOn(Date, 'now').mockReturnValue(1234567890123);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create a comment with required fields', () => {
      const user = { id: '1', name: 'John' };
      const content = 'Great post!';
      const postId = 'post-1';

      const comment = createComment({ user, content, postId });

      expect(comment.id).toBe('c1234567890123');
      expect(comment.user).toBe(user);
      expect(comment.content).toBe(content);
      expect(comment.timestamp).toBe('Just now');
      expect(comment.postId).toBe(postId);
    });
  });

  describe('addComment', () => {
    it('should add comment to array', () => {
      const comments = [{ id: 'c1', content: 'First' }];
      const newComment = { id: 'c2', content: 'Second' };

      const result = addComment(comments, newComment);

      expect(result.length).toBe(2);
      expect(result[result.length - 1]).toBe(newComment);
    });

    it('should not mutate original array', () => {
      const comments = [{ id: 'c1', content: 'First' }];
      const newComment = { id: 'c2', content: 'Second' };

      addComment(comments, newComment);

      expect(comments.length).toBe(1);
    });
  });

  describe('getCommentsForPost', () => {
    it('should return comments for specific post', () => {
      const comments = [
        { id: 'c1', postId: 'post-1', content: 'Comment 1' },
        { id: 'c2', postId: 'post-2', content: 'Comment 2' },
        { id: 'c3', postId: 'post-1', content: 'Comment 3' },
      ];

      const result = getCommentsForPost(comments, 'post-1');

      expect(result.length).toBe(2);
      expect(result.every((c) => c.postId === 'post-1')).toBe(true);
    });

    it('should return empty array if no comments for post', () => {
      const comments = [{ id: 'c1', postId: 'post-1', content: 'Comment 1' }];

      const result = getCommentsForPost(comments, 'post-2');

      expect(result).toEqual([]);
    });
  });

  describe('toggleCommentVisibility', () => {
    it('should add postId when not in array', () => {
      const visibleComments = ['post-1', 'post-2'];

      const result = toggleCommentVisibility(visibleComments, 'post-3');

      expect(result).toContain('post-3');
      expect(result.length).toBe(3);
    });

    it('should remove postId when already in array', () => {
      const visibleComments = ['post-1', 'post-2', 'post-3'];

      const result = toggleCommentVisibility(visibleComments, 'post-2');

      expect(result).not.toContain('post-2');
      expect(result.length).toBe(2);
    });

    it('should not mutate original array', () => {
      const visibleComments = ['post-1'];

      toggleCommentVisibility(visibleComments, 'post-2');

      expect(visibleComments.length).toBe(1);
    });
  });

  describe('generateShareUrl', () => {
    it('should generate URL with default base URL', () => {
      const result = generateShareUrl('post-123');

      expect(result).toContain('/post/post-123');
    });

    it('should generate URL with custom base URL', () => {
      const result = generateShareUrl('post-123', 'https://example.com');

      expect(result).toBe('https://example.com/post/post-123');
    });
  });

  describe('copyPostUrlToClipboard', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should copy URL to clipboard and return true on success', async () => {
      navigator.clipboard.writeText.mockResolvedValueOnce(undefined);

      const result = await copyPostUrlToClipboard('post-123');

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('/post/post-123')
      );
      expect(result).toBe(true);
    });

    it('should return false on clipboard error', async () => {
      navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Failed'));

      const result = await copyPostUrlToClipboard('post-123');

      expect(result).toBe(false);
    });
  });
});
