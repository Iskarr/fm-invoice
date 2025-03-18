import { Client, Databases } from "appwrite";

// const { Client, Databases, ID } = require("node-appwrite");

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67d2ee74001328e8f1e3");

const databases = new Databases(client);

let promise = databases.listDocuments(
  "67d2efac003166fecf8d",
  "67d2efb7000ad1c2cad0"
);

promise.then(
  function (response) {
    console.log(response);
  },
  function (error) {
    console.log(error);
  }
);

export { client, databases };

// import { ID, Models, Query } from "appwrite";
// import { client, databases, account, storage } from "./appwrite-connect"; // Import the initialized Appwrite client
// import { Account } from "appwrite";
// // Function to get account details
// async function getAccount() {
//   try {
//     const user = await account.get();
//     return user;
//   } catch (error) {
//     console.error("Failed to fetch account:", error);
//     return null;
//   }
// }

// // get currentUser
// const getCurrentUser = async () => {
//   try {
//     const account = new Account(client);
//     const user = await account.get();
//     return user;
//   } catch (error) {
//     console.error("Error fetching current user:", error);
//     return null;
//   }
// };

// // log the user out
// async function logout() {
//   try {
//     await account.deleteSession("current");
//     // window.location.reload();
//   } catch (error) {
//     console.error("Failed to logout:", error);
//   }
// }

// // get all posts
// async function getPosts(limit = 10, offset = 0) {
//   try {
//     const response = await databases.listDocuments(
//       "67d2efac003166fecf8d" as string,
//       "67d2efb7000ad1c2cad0" as string
//       //   [Query.limit(limit), Query.offset(offset)]
//     );
//     return response.documents;
//   } catch (error) {
//     console.error("Failed to fetch posts:", error);
//     return [];
//   }
// }

// // get single post by postId
// async function getPost(postId: string) {
//   try {
//     const response = await databases.getDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID as string,
//       process.env.NEXT_PUBLIC_NEWPOSTS_COLLECTION_ID as string,
//       postId
//     );
//     return response;
//   } catch (error) {
//     console.error("Failed to fetch post:", error);
//     return null;
//   }
// }

// // create post
// async function createPost(
//   e: React.FormEvent<HTMLFormElement>,
//   userEmail: string,
//   title: string,
//   content: string
// ) {
//   e.preventDefault();

//   try {
//     await databases.createDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID as string,
//       process.env.NEXT_PUBLIC_NEWPOSTS_COLLECTION_ID as string,
//       ID.unique(),
//       { from: userEmail, title: title, content: content }
//     );
//     // You might want to handle post creation success differently than reloading
//     // For example, updating the state or showing a success message
//     window.location.reload();
//   } catch (error) {
//     console.error("Failed to create post:", error);
//   }
// }

// // update post by postId
// async function updatePost(
//   postId: string,
//   title: string,
//   content: string,
//   tags: string[]
// ) {
//   try {
//     await databases.updateDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID as string,
//       process.env.NEXT_PUBLIC_NEWPOSTS_COLLECTION_ID as string,
//       postId,
//       { title: title, content: content, tags: tags }
//     );
//     // You might want to handle post update success differently than reloading
//     // For example, showing a success message
//     // window.location.reload();
//     // revalidatePath(`/post/${postId}`);
//   } catch (error) {
//     console.error("Failed to update post:", error);
//   }
// }

// // delete post by postId
// async function deletePost(postId: string) {
//   try {
//     await databases.deleteDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID as string,
//       process.env.NEXT_PUBLIC_NEWPOSTS_COLLECTION_ID as string,
//       postId
//     );
//     // You might want to handle post deletion success differently than reloading
//     // For example, showing a success message
//     window.location.reload();
//   } catch (error) {
//     console.error("Failed to delete post:", error);
//   }
// }

// // This function is used to like a post and unlike a post below that.
// async function likePost(postId: string, userId: string) {
//   try {
//     // Fetch the current state of the post
//     const post = await getPost(postId);
//     if (!post) {
//       throw new Error("Post not found");
//     }

//     // Check if the user has already liked this post
//     if (post.userId?.includes(userId)) {
//       throw new Error("User has already liked this post");
//     }

//     // Update the likes count and userId array
//     const currentLikes = post.likes || 0;
//     const updatedLikes = currentLikes + 1;
//     const updatedUserId = [...(post.userId || []), userId];

//     // Update the post with the new like count and userId array
//     await databases.updateDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID as string,
//       process.env.NEXT_PUBLIC_NEWPOSTS_COLLECTION_ID as string,
//       postId,
//       {
//         likes: updatedLikes,
//         userId: updatedUserId, // Fixed variable name here
//       }
//     );

//     console.log("Post liked successfully");
//   } catch (error) {
//     console.error("Failed to like post:", error);
//   }
// }

// // Unlike a post
// async function unlikePost(postId: string, userId: string) {
//   try {
//     // Fetch the current state of the post
//     const post = await getPost(postId);
//     if (!post) {
//       throw new Error("Post not found");
//     }

//     // Check if the user has liked this post
//     if (!post.userId?.includes(userId)) {
//       throw new Error("User has not liked this post");
//     }

//     // Remove the user ID from the userIds array
//     const updatedUserId = post.userId.filter((id: string) => id !== userId);

//     // Update the likes count and userIds array
//     const currentLikes = post.likes || 0;
//     const updatedLikes = Math.max(currentLikes - 1, 0); // Ensure likes don't go below 0

//     // Update the post with the new like count and userIds array
//     await databases.updateDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID as string,
//       process.env.NEXT_PUBLIC_NEWPOSTS_COLLECTION_ID as string,
//       postId,
//       {
//         likes: updatedLikes,
//         userId: updatedUserId, // Updated userId array
//       }
//     );

//     console.log("Post unliked successfully");
//   } catch (error) {
//     console.error("Failed to unlike post:", error);
//   }
// }
// // get liked posts for a user
// async function getLikedPostsForUser(
//   userId: string
// ): Promise<Models.Document[]> {
//   try {
//     // Fetch all posts from the database
//     const postsResponse = await databases.listDocuments(
//       process.env.NEXT_PUBLIC_DATABASE_ID as string,
//       process.env.NEXT_PUBLIC_NEWPOSTS_COLLECTION_ID as string
//     );

//     // Filter posts to find those liked by the user
//     const likedPosts = postsResponse.documents.filter((post: Models.Document) =>
//       post.userId?.includes(userId)
//     );

//     return likedPosts;
//   } catch (error) {
//     console.error("Failed to fetch liked posts for user:", error);
//     return [];
//   }
// }

// // get posts with related tags
// async function getPostsWithSimilarTags(): Promise<any[]> {
//   try {
//     // Fetch all posts from the database
//     const response = await databases.listDocuments(
//       process.env.NEXT_PUBLIC_DATABASE_ID as string, // Your database ID
//       process.env.NEXT_PUBLIC_NEWPOSTS_COLLECTION_ID as string // Your collection ID
//     );

//     const posts = response.documents;

//     if (posts.length === 0) {
//       return [];
//     }

//     // Find posts with similar tags
//     const similarPosts: Set<any> = new Set();
//     const tagMap: Record<string, any[]> = {};

//     // Create a map of tags to posts
//     posts.forEach((post) => {
//       if (post.tags) {
//         post.tags.forEach((tag: string) => {
//           if (!tagMap[tag]) {
//             tagMap[tag] = [];
//           }
//           tagMap[tag].push(post);
//         });
//       }
//     });

//     // Collect all posts that have similar tags
//     Object.values(tagMap).forEach((taggedPosts) => {
//       if (taggedPosts.length > 1) {
//         taggedPosts.forEach((post) => similarPosts.add(post));
//       }
//     });

//     // Convert Set to Array
//     const uniqueSimilarPosts = Array.from(similarPosts);
//     // console.log(uniqueSimilarPosts, "uniqueSimilarPosts");
//     return uniqueSimilarPosts;
//   } catch (error) {
//     console.error("Failed to fetch posts:", error);
//     throw error;
//   }
// }

// // create a comment on a post that will take the postId and the comment
// async function CreateComment(
//   post: string,
//   content: string,
//   from: string,
//   userLogic: string
// ) {
//   try {
//     await databases.createDocument(
//       process.env.NEXT_PUBLIC_DATABASE_ID as string,
//       process.env.NEXT_PUBLIC_COLLECTION_COMMENTS_ID as string,
//       ID.unique(),
//       { post: post, content: content, from: from, userLogic: userLogic }
//     );
//     // You might want to handle post creation success differently than reloading
//     // For example, updating the state or showing a success message
//     // window.location.reload();
//   } catch (error) {
//     console.error("Failed to create comment:", error);
//   }
// }

// async function getPostComments(postId: string) {
//   try {
//     const response = await databases.listDocuments(
//       process.env.NEXT_PUBLIC_DATABASE_ID as string,
//       process.env.NEXT_PUBLIC_COLLECTION_COMMENTS_ID as string,
//       [Query.equal("post", postId)]
//     );
//     return response.documents;
//   } catch (error) {
//     console.error("Failed to fetch comments:", error);
//     return [];
//   }
// }

// const getAllImagesFromBucket = async (
//   bucketId: string
// ): Promise<{ fileId: string; fileUrl: string | null }[]> => {
//   try {
//     // List all files in the bucket
//     const response = await storage.listFiles(bucketId);

//     // Extract file IDs and URLs
//     const images = await Promise.all(
//       response.files.map(async (file: { $id: any }) => {
//         try {
//           const url = await storage.getFilePreview(
//             bucketId,
//             file.$id,
//             200, // Width of the preview image
//             200 // Height of the preview image
//           );
//           return {
//             fileId: file.$id,
//             fileUrl: url || "/default_image.png", // Use URL or fallback to default image
//           };
//         } catch (error) {
//           console.error(`Failed to get preview for file ${file.$id}:`, error);
//           return {
//             fileId: file.$id,
//             fileUrl: "/default_image.png", // Use default image on error
//           };
//         }
//       })
//     );

//     return images;
//   } catch (error) {
//     console.error("Failed to fetch images from bucket:", error);
//     return [];
//   }
// };

// export {
//   getAccount,
//   getCurrentUser,
//   logout,
//   getPosts,
//   getPost,
//   createPost,
//   updatePost,
//   deletePost,
//   likePost,
//   unlikePost,
//   getLikedPostsForUser,
//   getPostsWithSimilarTags,
//   CreateComment,
//   getPostComments,
//   getAllImagesFromBucket,
// };
