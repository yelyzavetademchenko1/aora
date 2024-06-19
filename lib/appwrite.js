import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const appWriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.vlad_snowflake.aora",
    projectId: "6651f4bb001956310db1",
    dataBaseId: "6651f7a0000a3af90001",
    userCollectionId: "6651f7dd0008d54396df",
    videoCollectionId: "6651f81e001c9ef7b8b3",
    storageId: "6651fe550014d2e8e57b",
    bucketId: "6651fe550014d2e8e57b"
}

const client = new Client();

client
    .setEndpoint(appWriteConfig.endpoint)
    .setProject(appWriteConfig.projectId)
    .setPlatform(appWriteConfig.platform);

const account = new Account(client);

const avatars = new Avatars(client);

const db = new Databases(client);

const storage = new Storage(client);

export const createUser = async (email, password, userName) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, userName);

        if (!newAccount) {
            throw new Error;
        }

        const avatarURL = avatars.getInitials(userName);

        await signIn(email, password);

        const newUser = await db.createDocument(appWriteConfig.dataBaseId, appWriteConfig.userCollectionId, ID.unique(), {
            accountId: newAccount.$id,
            email,
            username: userName,
            avatar: avatarURL
        })

        return newUser;
    } catch (error) {
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) {
            throw new Error;
        }

        const currentUser = await db.listDocuments(appWriteConfig.dataBaseId, appWriteConfig.userCollectionId, [Query.equal('accountId', currentAccount.$id)]);

        if (!currentUser) {
            throw new Error;
        }

        return currentUser.documents[0];
    } catch (error) {
        throw new Error(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await db.listDocuments(appWriteConfig.dataBaseId, appWriteConfig.videoCollectionId, [Query.orderDesc("$createdAt")]);

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await db.listDocuments(appWriteConfig.dataBaseId, appWriteConfig.videoCollectionId, [Query.orderDesc("$createdAt", Query.limit(7))]);

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await db.listDocuments(appWriteConfig.dataBaseId, appWriteConfig.videoCollectionId, [Query.search("title", query)]);

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await db.listDocuments(appWriteConfig.dataBaseId, appWriteConfig.videoCollectionId, [Query.equal("creator", userId)]);

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getFilePreview = (fileId, type) => {
    let fileUrl;

    try {
        if (type === "image") {
            fileUrl = storage.getFilePreview(appWriteConfig.storageId, fileId, 2000, 2000, "top", 100);
        }
        else if (type === "video") {
            fileUrl = storage.getFileView(appWriteConfig.storageId, fileId);
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) {
            throw new Error;
        }

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}


export const uploadFile = async (file, type) => {
    if (!file) {
        return;
    }

    const asset = {
        size: file.fileSize,
        uri: file.uri,
        type: file.mimeType,
        name: file.fileName
    };

    try {
        const uploadedFile = await storage.createFile(appWriteConfig.storageId, ID.unique(), asset);

        const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/6651fe550014d2e8e57b/files/${uploadedFile.$id}/download?project=6651f4bb001956310db1&mode=admin`;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}


export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video")
        ]);

        const newPost = await db.createDocument(appWriteConfig.dataBaseId, appWriteConfig.videoCollectionId, ID.unique(), {
            title: form.title,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            prompt: form.prompt,
            creator: form.userId
        });

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}
