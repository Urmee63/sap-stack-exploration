import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, gql } from '@apollo/client';
import { TextField, Button, Paper, Typography, Box } from '@material-ui/core';

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String, $userId: ID!) {
    createPost(input: { title: $title, content: $content, userId: $userId }) {
      post {
        id
        title
      }
    }
  }
`;

interface AddPostProps {
  userId: string;
}

const AddPost: React.FC<AddPostProps> = ({ userId }) => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [createPost] = useMutation(CREATE_POST);

  const handleTitleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleContentChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  }, []);

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({
        variables: { title, content, userId },
      });
      setTitle('');
      setContent('');
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }, [createPost, title, content, userId]);

  return (
    <Paper elevation={1} style={{ padding: '12px', marginTop: '16px', borderRadius: '8px' }}>
      <Typography
        variant='overline'
        style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9e9e9e', display: 'block', marginBottom: '8px' }}
      >
        Create New Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label='Title'
          fullWidth
          value={title}
          onChange={handleTitleChange}
          margin='dense'
          size='small'
          InputLabelProps={{ style: { fontSize: '0.75rem' } }}
          InputProps={{ style: { fontSize: '0.8rem' } }}
        />
        <TextField
          label='Content'
          fullWidth
          multiline
          rows={2}
          value={content}
          onChange={handleContentChange}
          margin='dense'
          size='small'
          InputLabelProps={{ style: { fontSize: '0.75rem' } }}
          InputProps={{ style: { fontSize: '0.8rem' } }}
        />
        <Box mt={1} textAlign='right'>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            size='small'
            style={{ fontSize: '0.7rem', padding: '4px 12px', textTransform: 'none' }}
          >
            Add Post
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

AddPost.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default AddPost;