package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"
)

type AnalyticsEvent struct {
	UserID    int    `json:"user_id"`
	VideoID   int    `json:"video_id"`
	EventType string `json:"event_type"` // impression, play, pause, watch_time, completion, skip, rewatch, like, etc.
	Value     float64 `json:"value,omitempty"` // for watch_time in seconds, etc.
	Timestamp int64  `json:"timestamp"`
}

var ctx = context.Background()
var rdb *redis.Client
var chConn clickhouse.Conn

func main() {
	var err error

	// Connect to Redis
	redisAddr := getEnv("REDIS_ADDR", "localhost:6379")
	rdb = redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	_, err = rdb.Ping(ctx).Result()
	if err != nil {
		log.Printf("Warning: Could not connect to Redis: %v\n", err)
	} else {
		log.Println("Connected to Redis")
	}

	// Connect to ClickHouse
	chAddr := getEnv("CLICKHOUSE_ADDR", "localhost:9000")
	chConn, err = clickhouse.Open(&clickhouse.Options{
		Addr: []string{chAddr},
		Auth: clickhouse.Auth{
			Database: "nexora_feed",
			Username: "default",
			Password: "password",
		},
	})
	if err != nil {
		log.Printf("Warning: Could not connect to ClickHouse: %v\n", err)
	} else {
		log.Println("Connected to ClickHouse")
		initClickHouse()
	}

	r := mux.NewRouter()

	// API routes
	r.HandleFunc("/health", healthCheckHandler).Methods("GET")
	r.HandleFunc("/api/feed", getFeedHandler).Methods("GET")
	r.HandleFunc("/api/feed/shorts", getShortsFeedHandler).Methods("GET")
	r.HandleFunc("/api/events", recordEventHandler).Methods("POST")

	port := getEnv("PORT", "8082")
	log.Printf("Feed Service starting on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Feed Service is healthy"))
}

func getFeedHandler(w http.ResponseWriter, r *http.Request) {
	// Simple mock feed response
	feed := []map[string]interface{}{
		{"video_id": 1, "score": 0.95},
		{"video_id": 2, "score": 0.88},
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(feed)
}

func getShortsFeedHandler(w http.ResponseWriter, r *http.Request) {
	// Mock optimized batch of short-form video metadata and HLS manifest URLs
	// In production, this would be fetched via Redis (fast path) and ClickHouse analytics
	shorts := []map[string]interface{}{}
	
	for i := 1; i <= 5; i++ {
		shorts = append(shorts, map[string]interface{}{
			"id": i,
			"title": fmt.Sprintf("Short Video %d", i),
			"url": fmt.Sprintf("https://cdn.nexora.app/shorts/%d_master.m3u8", i),
			"author": fmt.Sprintf("creator_%d", i),
			"likes": i * 1234,
		})
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"data": shorts,
		"next_cursor": "encoded_cursor_string_here",
	})
}

func recordEventHandler(w http.ResponseWriter, r *http.Request) {
	var event AnalyticsEvent
	if err := json.NewDecoder(r.Body).Decode(&event); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate event type
	validEvents := map[string]bool{
		"impression": true, "play": true, "pause": true, "watch_time": true,
		"completion": true, "skip": true, "rewatch": true, "like": true,
		"dislike": true, "comment": true, "share": true, "subscribe": true,
		"search": true, "follow": true,
	}

	if !validEvents[event.EventType] {
		http.Error(w, "Invalid event type", http.StatusBadRequest)
		return
	}

	// Insert into ClickHouse (In production, batch insert using a background worker/buffer)
	if chConn != nil {
		query := `
			INSERT INTO analytics_events (user_id, video_id, event_type, value, timestamp)
			VALUES (?, ?, ?, ?, ?)
		`
		err := chConn.Exec(ctx, query,
			event.UserID,
			event.VideoID,
			event.EventType,
			event.Value,
			time.Unix(event.Timestamp, 0),
		)
		if err != nil {
			log.Printf("Failed to insert event to ClickHouse: %v\n", err)
		}
	}

	w.WriteHeader(http.StatusAccepted)
	w.Write([]byte("Event recorded for analytics"))
}

func initClickHouse() {
	query := `
		CREATE TABLE IF NOT EXISTS analytics_events (
			user_id UInt32,
			video_id UInt32,
			event_type LowCardinality(String),
			value Float64,
			timestamp DateTime
		) ENGINE = MergeTree()
		ORDER BY (timestamp, event_type, user_id)
	`
	err := chConn.Exec(ctx, query)
	if err != nil {
		log.Printf("Error initializing ClickHouse tables: %v\n", err)
	} else {
		log.Println("ClickHouse analytics_events table initialized")
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
