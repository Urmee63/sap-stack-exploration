package graphql

import (
	"backend/db"
	"backend/graphql/generated"
	"backend/graphql/resolvers"
	"net/http"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gorilla/mux"
)

const endpoint = "/graphql"

func Run(r *mux.Router, dbConn db.DB) {
	graphqlHandler, playgroundHandler := getHandlers(dbConn)

	r.HandleFunc(endpoint, playgroundHandler).Methods(http.MethodGet)
	r.Handle(endpoint, graphqlHandler).Methods(http.MethodPost, http.MethodOptions)
}

func getHandlers(dbConn db.DB) (*handler.Server, http.HandlerFunc) {
	schema := getSchema(dbConn)

	graphqlHandler := handler.NewDefaultServer(schema)
	playgroundHandler := playground.Handler("GraphQL Playground", endpoint)
	return graphqlHandler, playgroundHandler
}

func getSchema(dbConn db.DB) graphql.ExecutableSchema {
	postgres := dbConn.(db.Postgres)
	config := generated.Config{
		Resolvers: &resolvers.Resolver{Postgres: &postgres},
	}
	return generated.NewExecutableSchema(config)
}