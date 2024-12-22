import React, { useState } from 'react';
import axios from 'axios';

const Post = ({ post }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(`/api/post/${post.id}/comment`, { content: comment });
      setComments([...comments, response.data]);
      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="post">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <div className="comments">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
      <div className="comment-form">
        <input
          type="text"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Add a comment"
        />
        <button onClick={handleCommentSubmit}>Comment</button>
      </div>
    </div>
  );
};

export default Post;
