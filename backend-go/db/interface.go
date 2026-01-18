package db

import (
	"backend/graphql/generated"
	"context"
)

type DB interface {
	GetUser(ctx context.Context, id string) (*generated.User, error)
	GetPost(ctx context.Context, id string) (*generated.Post, error)
	GetPosts(ctx context.Context, userID string) ([]*generated.Post, error)
	AllPosts(ctx context.Context) ([]*generated.Post, error)
	CreatePost(ctx context.Context, input generated.CreatePostInput) (*generated.Post, error)
    DeletePost(ctx context.Context, id string) (bool, error)
}
