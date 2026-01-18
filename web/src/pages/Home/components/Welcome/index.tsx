import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Typography, CircularProgress, Paper, Box, Button, Grid } from '@material-ui/core';
import AddPost from './AddPost';

const GET_DATA = gql`
  query GetData($id: ID!) {
    getUser(input: { id: $id }) {
      user {
        id
        name
        email
        posts { id title content }
      }
    }
    allPosts {
      id
      title
      content
      author { name }
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

const UserPostItem = ({ post, onDelete }: { post: any, onDelete: (id: string) => void }) => {
  const handleIdDelete = React.useCallback(() => {
    onDelete(post.id);
  }, [onDelete, post.id]);

  return (
    <Paper variant='outlined' style={{ padding: '6px 10px', marginTop: '6px', backgroundColor: '#fafafa' }}>
      <Typography style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.2 }}>
        {post.title}
      </Typography>
      <Typography style={{ color: '#616161', fontSize: '0.75rem', marginTop: '2px', lineHeight: 1.3 }}>
        {post.content}
      </Typography>
      <Button
        size='small'
        color='secondary'
        onClick={handleIdDelete}
        style={{ marginTop: '4px', fontSize: '0.65rem', padding: '0px 4px', minWidth: 'unset' }}
      >
        Delete
      </Button>
    </Paper>
  );
};

const Welcome = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const initialUser = queryParams.get('userId') || '1';

  const [currentUserId, setCurrentUserId] = React.useState(initialUser);


  const { loading, error, data } = useQuery(GET_DATA, {
    variables: { id: currentUserId },
  });

  const [deletePost] = useMutation(DELETE_POST);

  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('userId') || '1';
      setCurrentUserId(id);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateUserInUrl = (id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('userId', id);
    window.history.pushState({}, '', url.toString());
    setCurrentUserId(id);
  };

  const handleSetUser1 = React.useCallback(() => {
    updateUserInUrl('1');
  }, []);

  const handleSetUser2 = React.useCallback(() => {
    updateUserInUrl('2');
  }, []);

  const handleDelete = React.useCallback(async (id: string) => {
    try {
      await deletePost({ variables: { id } });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }, [deletePost]);

  if (loading) return <CircularProgress size={24} style={{ display: 'block', margin: '50px auto' }} />;
  if (error) return <Typography color='error'>Error: {error.message}</Typography>;

  const user = data?.getUser?.user;
  const globalPosts = data?.allPosts || [];

  return (
    <Box>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={4}
      >
        <Typography variant='h6' style={{ fontWeight: 600 }}>Social Explorer</Typography>
        <Box>
          <Typography variant='caption' style={{ marginRight: '8px' }}>Login as:</Typography>
          <Button
            size='small'
            color='primary'
            variant={currentUserId === '1' ? 'contained' : 'outlined'}
            onClick={handleSetUser1}
          >
            User 1
          </Button>
          <Button
            size='small'
            color='primary'
            variant={currentUserId === '2' ? 'contained' : 'outlined'}
            onClick={handleSetUser2}
            style={{ marginLeft: '8px' }}
          >
            User 2
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={1} style={{ padding: '12px', borderRadius: '8px' }}>
            <Typography variant='overline' style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9e9e9e' }}>My Profile</Typography>
            {user && (
              <Box mt={1}>
                <Typography style={{ fontSize: '0.8rem' }}><strong>{user.name}</strong></Typography>
                <Typography style={{ fontSize: '0.75rem', color: '#757575' }}>{user.email}</Typography>
                <Box mt={2}>
                  <Typography style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3f51b5' }}>YOUR POSTS</Typography>
                  {user.posts?.map((p: any) => (
                    <UserPostItem
                      key={p.id}
                      post={p}
                      onDelete={handleDelete}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
          <AddPost userId={currentUserId} />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={1} style={{ padding: '16px', borderRadius: '8px', minHeight: '80vh' }}>
            <Typography variant='subtitle2' color='primary' style={{ fontWeight: 700, marginBottom: '16px' }}>GLOBAL FEED</Typography>
            {globalPosts.map((post: any) => (
              <Paper
                key={post.id}
                variant='outlined'
                style={{ padding: '12px', marginBottom: '12px', backgroundColor: '#fafafa' }}
              >
                <Typography style={{ fontSize: '0.65rem', fontWeight: 700, color: '#3f51b5' }}>@{post.author?.name}</Typography>
                <Typography style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>{post.title}</Typography>
                <Typography style={{ fontSize: '0.75rem', color: '#616161' }}>{post.content}</Typography>
              </Paper>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Welcome;