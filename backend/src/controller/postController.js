import { pool } from "../config/pool.js";
import cloudinary from "../utils/cloudinary.js";
import { createNotification } from "../utils/notification.js";

const extractHashtags = (caption) => {
  const regex = /#(\w+)/g;
  const matches = caption.match(regex);
  return matches
    ? [...new Set(matches.map((tag) => tag.slice(1).toLowerCase()))]
    : [];
};

// Create a new post
export const createPost = async (req, res) => {
  const { caption } = req.body;
  const mediaFiles = req.files;
  console.log(caption, mediaFiles);

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO posts (user_id, caption)
        VALUES ($1, $2)
        RETURNING id, caption, created_at`,
      [userId, caption]
    );

    //UPLOAD ON CLOUDINARY
    const post = result.rows[0];
    const postId = post.id;
    let uploadedImages = [];
    if (mediaFiles && mediaFiles.length > 0) {
      const uploadPromises = mediaFiles.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: `users/${userId}/posts/${postId}/images`,
          public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        })
      );
      uploadedImages = await Promise.all(uploadPromises);

      //SAVE TO TABLE
      const insertImagePromises = uploadedImages.map((img) =>
        pool.query(
          `INSERT INTO post_images (post_id, image_url) VALUES ($1, $2)`,
          [postId, img.secure_url]
        )
      );
      await Promise.all(insertImagePromises);
    }

    const hashtags = extractHashtags(caption);
    for (const tag of hashtags) {
      const tagResult = await pool.query(
        `INSERT INTO hashtags (name)
         VALUES ($1)
         ON CONFLICT (name) DO NOTHING
         RETURNING id`,
        [tag]
      );

      // Get hashtag ID (either from INSERT or SELECT)
      const hashtagId =
        tagResult.rows[0]?.id ||
        (await pool.query(`SELECT id FROM hashtags WHERE name = $1`, [tag]))
          .rows[0].id;

      await pool.query(
        `INSERT INTO post_hashtags (post_id, hashtag_id) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [post.id, hashtagId]
      );
    }

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post with hashtags:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all posts with optional user filter
export const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const userId = req.query.userId;

  try {
    const baseQuery = `
      SELECT 
        posts.*, 
        users.username, 
        users.profile_pic_url,
        COALESCE(json_agg(post_images.image_url) FILTER (WHERE post_images.image_url IS NOT NULL), '[]') AS images
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN post_images ON posts.id = post_images.post_id
      ${userId ? "WHERE posts.user_id = $3" : ""}
      GROUP BY posts.id, users.username, users.profile_pic_url
      ORDER BY posts.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const values = userId ? [limit, offset, userId] : [limit, offset];

    const result = await pool.query(baseQuery, values);

    res.status(200).json({
      page,
      posts: result.rows,
      hasMore: result.rows.length === limit,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: error.message });
  }
};

// React to a post
export const reactToPost = async (req, res) => {
  const { post_id, reaction_type } = req.body;
  const userId = req.user.id;

  const validReactions = ["like", "haha", "wow", "cry", "angry"];
  if (!validReactions.includes(reaction_type)) {
    return res.status(400).json({ error: "Invalid reaction type" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reactions (user_id, post_id, reaction_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, post_id) 
       DO UPDATE SET reaction_type = EXCLUDED.reaction_type, created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, post_id, reaction_type]
    );

    // logic to create a notification
    const postResult = await pool.query(
      `SELECT user_id FROM posts WHERE id = $1`,
      [post_id]
    );

    const postOwnerId = postResult.rows[0]?.user_id;
    if (postOwnerId && postOwnerId !== userId) {
      await createNotification(postOwnerId, reaction_type, userId, post_id);
    }

    res
      .status(200)
      .json({ message: "Reaction recorded", reaction: result.rows[0] });
  } catch (error) {
    console.error("Error reacting to post:", error);
    res.status(500).json({ error: error.message });
  }
};

// Remove reaction from a post
export const removeReaction = async (req, res) => {
  const { post_id } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `DELETE FROM reactions WHERE user_id = $1 AND post_id = $2 RETURNING *`,
      [userId, post_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Reaction not found" });
    }

    res.status(200).json({ message: "Reaction removed" });
  } catch (error) {
    console.error("Error removing reaction:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get reaction counts on a post
export const getReactions = async (req, res) => {
  const postId = parseInt(req.params.postId);

  try {
    const result = await pool.query(
      `SELECT reaction_type, COUNT(*) AS count
       FROM reactions
       WHERE post_id = $1
       GROUP BY reaction_type`,
      [postId]
    );

    // Format result into an object
    const reactionCounts = {
      like: 0,
      haha: 0,
      wow: 0,
      cry: 0,
      angry: 0,
    };

    result.rows.forEach((row) => {
      reactionCounts[row.reaction_type] = parseInt(row.count);
    });

    res.status(200).json(reactionCounts);
  } catch (error) {
    console.error("Error fetching reaction counts:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get the current user's reaction on a specific post
export const getMyReaction = async (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.postId);

  try {
    const result = await pool.query(
      `SELECT reaction_type FROM reactions WHERE user_id = $1 AND post_id = $2`,
      [userId, postId]
    );

    res.status(200).json({ reaction: result.rows[0]?.reaction_type || null });
  } catch (error) {
    console.error("Error fetching user reaction:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all reactions for a post
export const getReactionsByPost = async (req, res) => {
  const postId = parseInt(req.params.postId);

  try {
    const result = await pool.query(
      `SELECT user_id, reaction_type FROM reactions WHERE post_id = $1`,
      [postId]
    );

    res.status(200).json({ reactions: result.rows });
  } catch (error) {
    console.error("Error fetching reactions for post:", error);
    res.status(500).json({ error: error.message });
  }
};

// Comment on a post
export const commentPost = async (req, res) => {
  const { post_id, content } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO comments (user_id, post_id, content) 
       VALUES ($1, $2, $3) 
       RETURNING id, user_id, post_id, content, created_at`,
      [userId, post_id, content]
    );

    // logic to create a notification
    const postResult = await pool.query(
      `SELECT user_id FROM posts WHERE id = $1`,
      [post_id]
    );

    const postOwnerId = postResult.rows[0]?.user_id;
    if (postOwnerId && postOwnerId !== userId) {
      await createNotification(postOwnerId, "comment", userId, post_id);
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error commenting on post:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get comments of a post
export const getComments = async (req, res) => {
  const postId = parseInt(req.params.postId);

  try {
    const result = await pool.query(
      `SELECT comments.*, users.username, users.profile_pic_url 
       FROM comments 
       JOIN users ON comments.user_id = users.id 
       WHERE post_id = $1 
       ORDER BY comments.created_at ASC`,
      [postId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: error.message });
  }
};

//Get number of comments on a post
export const getCommentCount = async (req, res) => {
  const postId = parseInt(req.params.postId);

  try {
    const result = await pool.query(
      `SELECT COUNT(*) AS comment_count
       FROM comments
        WHERE post_id = $1`,
      [postId]
    );

    res
      .status(200)
      .json({ commentCount: parseInt(result.rows[0].comment_count) });
  } catch (error) {
    console.error("Error counting comments:", error);
    res.status(500).json({ error: error.message });
  }
};

//Delete a comment (only if user is the owner)
export const deleteComment = async (req, res) => {
  const commentId = parseInt(req.params.commentId);
  const userId = req.user.id;

  try {
    // Check if the comment exists and belongs to the user
    const check = await pool.query(
      `SELECT * FROM comments WHERE id = $1 AND user_id = $2`,
      [commentId, userId]
    );

    if (check.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Unauthorized or comment not found" });
    }

    // Delete the comment
    await pool.query(`DELETE FROM comments WHERE id = $1`, [commentId]);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a post (only if user is the owner)
export const deletePost = async (req, res) => {
  const postId = parseInt(req.params.postId);

  const userId = req.user.id;

  try {
    const check = await pool.query(
      `SELECT * FROM posts WHERE id = $1 AND user_id = $2`,
      [postId, userId]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized or post not found" });
    }

    await pool.query(`DELETE FROM posts WHERE id = $1`, [postId]);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get single post with likes and comments
export const getSinglePost = async (req, res) => {
  const postId = parseInt(req.params.postId);
  const userId = req.user.id;
  console.log("Post ID:", postId);
  try {
    // Fetch the post details
    const postResult = await pool.query(
      `SELECT posts.*, users.username, users.profile_pic_url
       FROM posts 
       JOIN users ON posts.user_id = users.id 
       WHERE posts.id = $1`,
      [postId]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = postResult.rows[0];
    // Fetch images of the post
    const imageResult = await pool.query(
      `SELECT image_url FROM post_images WHERE post_id = $1`,
      [postId]
    );
    const images = imageResult.rows.map((row) => row.image_url);

    // Fetch likes for the post
    const reactionsResult = await pool.query(
      `SELECT users.id, users.username, users.profile_pic_url, reactions.reaction_type
       FROM reactions
       JOIN users ON reactions.user_id = users.id
       WHERE reactions.post_id = $1`,
      [postId]
    );

    // Fetch comments for the post
    const commentsResult = await pool.query(
      `SELECT comments.*, users.username, users.profile_pic_url 
       FROM comments 
       JOIN users ON comments.user_id = users.id 
       WHERE post_id = $1 
       ORDER BY comments.created_at ASC`,
      [postId]
    );
    console.log(images);
    // Include userId in the response
    res.status(200).json({
      post: {
        ...post,
        images,
      },
      likes: likesResult.rows,
      comments: commentsResult.rows,
      userId: userId, // Include the userId of the authenticated user
    });
  } catch (error) {
    console.error("Error fetching post details:", error);
    res.status(500).json({ error: error.message });
  }
};

// Edit post caption (only by owner)
// Edit post caption (only by owner)
export const editPost = async (req, res) => {
  const { caption } = req.body;
  const postId = parseInt(req.params.postId);
  const userId = req.user.id;

  try {
    // Check if the post exists and belongs to the user
    const check = await pool.query(
      `SELECT * FROM posts WHERE id = $1 AND user_id = $2`,
      [postId, userId]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized or post not found" });
    }

    // Update the caption
    await pool.query(`UPDATE posts SET caption = $1 WHERE id = $2`, [
      caption,
      postId,
    ]);

    // Remove existing hashtag links
    await pool.query(`DELETE FROM post_hashtags WHERE post_id = $1`, [postId]);

    // Extract and re-insert hashtags
    const hashtags = extractHashtags(caption);
    for (const tag of hashtags) {
      const tagResult = await pool.query(
        `INSERT INTO hashtags (name)
         VALUES ($1)
         ON CONFLICT (name) DO NOTHING
         RETURNING id`,
        [tag]
      );

      const hashtagId =
        tagResult.rows[0]?.id ||
        (await pool.query(`SELECT id FROM hashtags WHERE name = $1`, [tag]))
          .rows[0].id;

      await pool.query(
        `INSERT INTO post_hashtags (post_id, hashtag_id) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [postId, hashtagId]
      );
    }

    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error editing post:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get the latest post from a specific user
export const getLatestPostByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query(
      `SELECT 
        posts.*, 
        users.username, 
        users.profile_pic_url,
        COALESCE(json_agg(post_images.image_url) 
          FILTER (WHERE post_images.image_url IS NOT NULL), '[]') AS images
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN post_images ON posts.id = post_images.post_id
      WHERE posts.user_id = $1
      GROUP BY posts.id, users.username, users.profile_pic_url
      ORDER BY posts.created_at DESC
      LIMIT 1`,
      [userId]
    );

    res.status(200).json({
      data: result.rows.length > 0 ? result.rows[0] : null,
    });
  } catch (error) {
    console.error("Error fetching latest post:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getPostsByHashtag = async (req, res) => {
  const { tag } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         posts.*, 
         users.username, 
         users.full_name, 
         users.email, 
         users.profile_pic_url,
         COALESCE(
           json_agg(post_images.image_url) 
           FILTER (WHERE post_images.image_url IS NOT NULL), 
           '[]'
         ) AS images
       FROM posts
       JOIN post_hashtags ON posts.id = post_hashtags.post_id
       JOIN hashtags ON post_hashtags.hashtag_id = hashtags.id
       JOIN users ON posts.user_id = users.id
       LEFT JOIN post_images ON posts.id = post_images.post_id
       WHERE LOWER(hashtags.name) = $1
       GROUP BY posts.id, users.username, users.full_name, users.email, users.profile_pic_url
       ORDER BY posts.created_at DESC`,
      [tag.toLowerCase()]
    );

    const formData = result.rows.map(row => ({
      post: {
        id: row.id,
        caption: row.caption,
        created_at: row.created_at,
        images: row.images,
        profile_pic_url: row.profile_pic_url,
        user_id: row.user_id,
        username: row.username,
      },
      profile: {
        id: row.user_id,
        username: row.username,
        full_name: row.full_name,
        email: row.email,
        profile_pic_url: row.profile_pic_url,
      }
    }));

    res.status(200).json(formData);
  } catch (error) {
    console.error("Error fetching posts by hashtag:", error);
    res.status(500).json({ error: error.message });
  }
};

// Search for hashtags
export const searchHashtags = async (req, res) => {
  const { keyword } = req.query;

  if (!keyword || keyword.trim() === "") {
    return res.status(400).json({ error: "Keyword is required" });
  }
  try {
    const result = await pool.query(
      `SELECT 
        h.id AS id,
        h.name AS name,
        COUNT(ph.post_id) AS post_count
      FROM 
        hashtags h
      LEFT JOIN 
        post_hashtags ph ON h.id = ph.hashtag_id
      WHERE 
        h.name ILIKE $1
      GROUP BY 
        h.id, h.name
      ORDER BY 
        h.name ASC
      LIMIT 20`,
      [`%${keyword}%`]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error searching hashtags:", error);
    res.status(500).json({ error: error.message });
  }
};
  
// Get posts by a specific user with images
export const getUserPostsWithImages = async (req, res) => {
   const userId = parseInt(req.params.userId);
   try {
    const result = await pool.query(
      `SELECT 
        posts.*, 
        COALESCE(json_agg(post_images.image_url) 
          FILTER (WHERE post_images.image_url IS NOT NULL), '[]') AS images
      FROM posts
      LEFT JOIN post_images ON posts.id = post_images.post_id
      WHERE posts.user_id = $1
      GROUP BY posts.id
      ORDER BY posts.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      posts: result.rows,
    });
  } catch (error) {
    console.error("Error fetching user posts with images:", error);
    res.status(500).json({ error: error.message });
  }
};
