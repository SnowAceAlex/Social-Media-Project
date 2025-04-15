// Create a new post
exports.createPost = async (req, res) => {
  const { user_id, caption, media_url } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO posts (user_id, caption, media_url) VALUES ($1, $2, $3) RETURNING *",
      [user_id, caption, media_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all posts (with basic info)
exports.getAllPosts = async (req, res) => {
  try {
    const result = await db.query(`
        SELECT posts.*, users.username 
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        ORDER BY posts.created_at DESC
      `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  const { user_id, post_id } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *",
      [user_id, post_id]
    );
    if (result.rowCount === 0) {
      return res.status(200).json({ message: "Already liked" });
    }
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Comment on a post
exports.commentPost = async (req, res) => {
  const { user_id, post_id, content } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *",
      [user_id, post_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error commenting on post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
