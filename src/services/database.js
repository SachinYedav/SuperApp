import config from '@/conf/config';
import { Client, ID, Databases, Storage, Query } from 'appwrite';
import { ARCADE_GAMES } from '@/features/arcade/constants';

/**
 * DatabaseService
 * Handles all interactions with Appwrite Databases and Storage.
 * Includes user profiles, file management, search history, and arcade leaderboards.
 */
export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
            
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    /* ============================================================
     * PROFILE MANAGEMENT
     * ============================================================ */

    async createUserProfile({ userId, name, email, bio = "", avatarUrl = null }) {
        try {
            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteUsersCollectionId,
                userId, 
                { userId, name, email, bio, avatarUrl }
            );
        } catch (error) {
            console.log("DatabaseService :: createUserProfile :: error", error);
            // Return null if document already exists (Conflict)
            if (error.code === 409) return null; 
            throw error;
        }
    }

    async getUserProfile(userId) {
        try {
            // 1. Primary: Direct Document Access (Fastest)
            return await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteUsersCollectionId,
                userId
            );
        } catch (error) {
            // 2. Fallback: Query by attribute if direct access fails 
            if (error.code === 404) {
                return await this.getProfileByQuery(userId);
            }
            console.log("DatabaseService :: getUserProfile :: error", error);
            return null;
        }
    }

    /**
     * Helper method to query user profile by userId attribute.
     */
    async getProfileByQuery(userId) {
        try {
            const list = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteUsersCollectionId,
                [Query.equal("userId", userId)]
            );
            return list.documents.length > 0 ? list.documents[0] : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Updates an existing user profile document.
     */
    async updateUserProfile(docId, data) {
        try {
            return await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteUsersCollectionId,
                docId,
                data
            );
        } catch (error) {
            console.log("DatabaseService :: updateUserProfile :: error", error);
            throw error;
        }
    }

    /* ============================================================
     * FILE MANAGEMENT (STORAGE & METADATA)
     * ============================================================ */

    async uploadFile(file, userId) {
        try {
            // Step A: Upload raw file to Appwrite Storage Bucket
            const uploadedFile = await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            );

            // Step B: Generate File View URL
            const result = this.bucket.getFileView(
                config.appwriteBucketId,
                uploadedFile.$id
            );
            const fileUrl = typeof result === 'string' ? result : result.href;

            // Step C: Persist File Metadata in Database
            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId, 
                ID.unique(),
                {
                    userId: userId,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    url: fileUrl,
                    bucketFileId: uploadedFile.$id 
                }
            );
        } catch (error) {
            console.log("DatabaseService :: uploadFile :: error", error);
            return false;
        }
    }

    /**
     * Fetches all files associated with a specific user, sorted by creation date.
     */
    async getFiles(userId) {
        try {
            return await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                [
                    Query.equal("userId", userId),
                    Query.orderDesc("$createdAt")
                ]
            );
        } catch (error) {
            console.log("DatabaseService :: getFiles :: error", error);
            return false;
        }
    }

    /**
     * Deletes a file from both the storage bucket and its metadata from the database.
     */
    async deleteFile(docId, bucketFileId) {
        try {
            // Step A: Remove from Storage Bucket
            if (bucketFileId) {
                await this.bucket.deleteFile(config.appwriteBucketId, bucketFileId);
            }

            // Step B: Remove Metadata from Database
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                docId
            );
            return true;
        } catch (error) {
            console.log("DatabaseService :: deleteFile :: error", error);
            return false;
        }
    }

    /* ============================================================
     * SEARCH HISTORY MANAGEMENT (AUTO-MAINTAINED)
     * ============================================================ */

    /**
     * Retrieves the top 5 most recent search history records for a user.
     */
    async getSearchHistory(userId) {
        try {
            return await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteSearchHistoryCollectionId,
                [
                    Query.equal("userId", userId),
                    Query.orderDesc("$createdAt"),
                    Query.limit(5)
                ]
            );
        } catch (error) {
            console.log("Service :: getSearchHistory :: error", error);
            return { documents: [] };
        }
    }

    /**
     * Adds a new search entry. Automatically removes duplicates and 
     * enforces a maximum limit of 5 history items per user.
     */
    async addSearchHistory(userId, searchData) {
        try {
            // Step A: Identify and remove duplicate search queries
            const existing = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteSearchHistoryCollectionId,
                [
                    Query.equal("userId", userId),
                    Query.equal("title", searchData.title) 
                ]
            );

            if (existing.documents.length > 0) {
                for (let doc of existing.documents) {
                    await this.deleteSearchHistory(doc.$id);
                }
            }

            // Step B: Create the new search record
            const newDoc = await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteSearchHistoryCollectionId,
                ID.unique(),
                {
                    userId: userId,
                    title: searchData.title,
                    path: searchData.path || "",
                    type: searchData.type || "History",
                    iconName: searchData.iconName || "Search"
                }
            );

            // Step C: Auto-Cleanup (Maintain rolling limit of 5 records)
            const allHistory = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteSearchHistoryCollectionId,
                [
                    Query.equal("userId", userId),
                    Query.orderDesc("$createdAt") 
                ]
            );

            if (allHistory.documents.length > 5) {
                const docsToDelete = allHistory.documents.slice(5); 
                for (let doc of docsToDelete) {
                    await this.deleteSearchHistory(doc.$id);
                }
            }

            return newDoc;
        } catch (error) {
            console.log("Service :: addSearchHistory :: error", error);
            return null;
        }
    }

    /**
     * Deletes a specific search history document.
     */
    async deleteSearchHistory(docId) {
        try {
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteSearchHistoryCollectionId,
                docId
            );
            return true;
        } catch (error) {
            console.log("Service :: deleteSearchHistory :: error", error);
            return false;
        }
    }

    /**
     * Clears all search history for a specific user.
     */
    async clearAllSearchHistory(userId) {
        try {
            const allHistory = await this.getSearchHistory(userId); 
            for (let doc of allHistory.documents) {
                await this.deleteSearchHistory(doc.$id);
            }
            return true;
        } catch(error) {
            console.log("Service :: clearAllSearchHistory :: error", error);
            return false;
        }
    }

    /* ============================================================
     * ARCADE & LEADERBOARD SERVICES
     * ============================================================ */

    /**
     * Submits a new high score for an arcade game.
     * Evaluates the score against existing records based on game rules (ASC/DESC).
     */
    async saveHighScore({ userId, userName, gameId, score }) {
        try {
            // 1. Determine Win Condition (Lowest time vs Highest points)
            const gameConfig = ARCADE_GAMES.find(g => g.id === gameId);
            const isLowScoreWinner = gameConfig?.scoreType === 'ASC';

            // 2. Retrieve Existing Record
            const existing = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdScores,
                [
                    Query.equal('userId', userId),
                    Query.equal('gameId', gameId)
                ]
            );

            if (existing.documents.length > 0) {
                const doc = existing.documents[0];
                const oldScore = doc.score;

                // 3. Evaluate New Score against Old Score
                let shouldUpdate = false;
                if (isLowScoreWinner) {
                    if (score < oldScore) shouldUpdate = true; 
                } else {
                    if (score > oldScore) shouldUpdate = true; 
                }

                // Prevent redundant database writes
                if (score === oldScore) return null; 

                if (shouldUpdate) {
                    return await this.databases.updateDocument(
                        config.appwriteDatabaseId,
                        config.appwriteCollectionIdScores,
                        doc.$id,
                        { score, userName }
                    );
                } else {
                    return null; // Score did not beat the existing record
                }
            } else {
                // 4. Create Initial Record if none exists
                return await this.databases.createDocument(
                    config.appwriteDatabaseId,
                    config.appwriteCollectionIdScores,
                    ID.unique(),
                    { userId, userName, gameId, score }
                );
            }
        } catch (error) {
            console.error("Save Score Error:", error);
            return false;
        }
    }

    /**
     * Retrieves the leaderboard for a specific game.
     * Sorts based on the predefined configuration of the game.
     */
    async getLeaderboard(gameId, limit = 10) {
        try {
            const gameConfig = ARCADE_GAMES.find(g => g.id === gameId);
            const sortOrder = gameConfig?.scoreType === 'ASC' 
                ? Query.orderAsc('score') 
                : Query.orderDesc('score'); 

            return await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionIdScores,
                [
                    Query.equal('gameId', gameId),
                    sortOrder,
                    Query.limit(limit)
                ]
            );
        } catch (error) {
            console.error("Leaderboard Error:", error);
            return false;
        }
    }
}

const service = new Service();
export default service;